# HogarIA — Plan de backend

Este documento describe cómo se planea conectar HogarIA con un backend real
basado en **Supabase** (Postgres + Auth + Storage + RLS) y **OpenAI** para las
recomendaciones inteligentes.

> Estado actual: MVP frontend con datos mockeados en `lib/mock/*`. Toda la
> capa de datos pasa por funciones puras y tipos en `lib/types.ts`, lo que
> facilita reemplazarla por queries reales sin tocar componentes.

## 1. Modelo de datos sugerido (Postgres / Supabase)

```sql
-- Hogares
households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  currency text not null default 'ARS',
  created_at timestamptz default now()
);

-- Perfiles de usuario (extiende auth.users)
profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_url text,
  default_household_id uuid references households on delete set null
);

-- Miembros de un hogar (n a n)
household_members (
  household_id uuid references households on delete cascade,
  profile_id uuid references profiles on delete cascade,
  role text check (role in ('admin','member','guest')) default 'member',
  joined_at timestamptz default now(),
  primary key (household_id, profile_id)
);

-- Categorías (globales del hogar)
categories (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade,
  name text not null,
  kind text check (kind in ('ingreso','gasto')) not null,
  icon text,
  color text
);

-- Movimientos
transactions (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade,
  profile_id uuid references profiles on delete set null,
  type text check (type in ('ingreso','gasto','transferencia','ahorro','inversion')) not null,
  expense_kind text check (expense_kind in ('fijo','variable')),
  scope text check (scope in ('hogar','personal','compartido')) default 'hogar',
  member_id uuid references profiles on delete set null,
  category_id uuid references categories on delete set null,
  account_id uuid references accounts on delete set null,
  linked_goal_id uuid references goals on delete set null,
  payment_method text check (payment_method in ('efectivo','debito','credito','transferencia','mercadopago','cripto','otro')),
  description text,
  notes text,
  amount numeric(14,2) not null,
  date date not null,
  recurring boolean default false,
  created_at timestamptz default now()
);

-- Tabla puente: gastos repartidos entre varios integrantes (split bills)
transaction_members (
  transaction_id uuid references transactions on delete cascade,
  profile_id uuid references profiles on delete cascade,
  share numeric(6,4) not null default 1.0, -- 0.5 = 50%
  primary key (transaction_id, profile_id)
);

-- Vencimientos / facturas
bills (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade,
  title text not null,
  category_id uuid references categories on delete set null,
  amount numeric(14,2) not null,
  due_date date not null,
  status text check (status in ('pendiente','pagado','vencido','proximo')) default 'pendiente',
  auto_debit boolean default false,
  responsible_id uuid references profiles on delete set null
);

-- Tareas del hogar
tasks (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade,
  title text not null,
  description text,
  status text check (status in ('pendiente','en-progreso','completado','vencido')) default 'pendiente',
  priority text check (priority in ('baja','media','alta')) default 'media',
  due_date date,
  responsible_id uuid references profiles,
  area text
);

-- Lista de compras
shopping_items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade,
  name text not null,
  quantity numeric default 1,
  unit text,
  estimated_price numeric(14,2),
  category text,
  priority text default 'media',
  bought boolean default false,
  added_by uuid references profiles
);

-- Mantenimiento
maintenance_items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade,
  title text not null,
  asset text,
  last_done date,
  next_due date not null,
  interval_months int default 6,
  responsible_id uuid references profiles,
  notes text
);

-- Documentos (referencia a Supabase Storage)
documents (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade,
  title text not null,
  category text,
  storage_path text not null,
  expires_at date,
  uploaded_by uuid references profiles,
  uploaded_at timestamptz default now()
);

-- Objetivos de ahorro
goals (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade,
  title text not null,
  target numeric(14,2) not null,
  saved numeric(14,2) default 0,
  monthly_contribution numeric(14,2),
  deadline date,
  emoji text
);

-- Cuentas y bolsillos donde el hogar guarda y mueve dinero
accounts (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade,
  name text not null,
  kind text check (kind in ('efectivo','caja-ahorro','cuenta-remunerada','billetera','dolares','fci','plazo-fijo','cripto')) not null,
  balance numeric(14,2) not null default 0,
  currency text not null default 'ARS',
  is_saving boolean default false,
  member_id uuid references profiles on delete set null,
  color text,
  notes text
);

-- "Bolsillos" mentales del ahorro (puede no coincidir con cuentas reales)
savings_accounts (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade,
  name text not null,
  amount numeric(14,2) not null default 0,
  account_id uuid references accounts on delete set null,
  goal_id uuid references goals on delete set null,
  emoji text
);

-- Inversiones registradas (mock o reales). NO es asesoramiento financiero.
investments (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade,
  name text not null,
  type text check (type in ('fci','plazo-fijo','dolar','acciones','bonos','cripto','otro')) not null,
  principal numeric(14,2) not null default 0,
  current_value numeric(14,2) not null default 0,
  started_at date,
  matures_at date,
  member_id uuid references profiles on delete set null,
  notes text
);

-- Presupuestos personales por integrante
personal_budgets (
  household_id uuid references households on delete cascade,
  profile_id uuid references profiles on delete cascade,
  monthly_budget numeric(14,2) not null default 0,
  by_category jsonb default '{}'::jsonb,
  primary key (household_id, profile_id)
);

-- Preferencia de organización financiera por integrante
member_financial_profiles (
  profile_id uuid primary key references profiles on delete cascade,
  household_id uuid references households on delete cascade,
  profile text check (profile in ('conservador','equilibrado','agresivo')) default 'equilibrado',
  show_personal_to_household boolean default false,
  updated_at timestamptz default now()
);

-- Snapshots mensuales del patrimonio para graficar evolución
net_worth_snapshots (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade,
  month date not null,
  assets numeric(14,2) not null default 0,
  liabilities numeric(14,2) not null default 0,
  computed_at timestamptz default now(),
  unique (household_id, month)
);

-- Recomendaciones generadas por la IA (heurística local + capa OpenAI)
ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade,
  level text check (level in ('info','positivo','atencion','alerta')),
  module text,
  group_key text check (group_key in ('finanzas','ahorro','inversiones','hogar','vencimientos','gastos-personales','objetivos','riesgo')),
  priority text check (priority in ('low','medium','high')) default 'medium',
  title text not null,
  description text,
  action_label text,
  action_href text,
  related_amount numeric(14,2),
  member_id uuid references profiles on delete set null,
  created_at timestamptz default now(),
  dismissed_at timestamptz
);

-- Alias semántico: recomendaciones específicamente financieras (vista materializada)
-- Se puede crear como `create view financial_recommendations as
--   select * from ai_recommendations where group_key in ('finanzas','ahorro','inversiones','objetivos','gastos-personales');`

-- Notificaciones
notifications (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade,
  profile_id uuid references profiles,
  title text not null,
  body text,
  channel text check (channel in ('app','email','push','whatsapp')) default 'app',
  read boolean default false,
  scheduled_for timestamptz,
  created_at timestamptz default now()
);
```

### Relaciones clave

```
households 1 ─── n household_members ─── 1 profiles
                                        │
households 1 ─── n accounts ─── 0/n savings_accounts ─── 0/1 goals
                          │                       
                          └── 0/n investments
                          
households 1 ─── n transactions ─── 0/1 accounts
                              │  ─── 0/1 categories
                              │  ─── 0/1 goals (linked_goal_id)
                              │  ─── 0/1 profiles (member_id)
                              └── 0/n transaction_members  (split bills)
                              
households 1 ─── n personal_budgets ─── 1 profiles
households 1 ─── n bills ─── 0/1 categories ─── 0/1 profiles (responsible)
households 1 ─── n goals (objetivos del hogar)
households 1 ─── n net_worth_snapshots (un row por mes)
households 1 ─── n ai_recommendations ─── 0/1 profiles (member_id)
profiles  1 ─── 1 member_financial_profiles
```

### Notas de diseño

- **`transactions.type = 'ahorro'` y `'inversion'`** se modelan como movimientos
  hacia una `account_id` (no afectan el presupuesto de gastos del hogar).
- **`transactions.scope`** separa lo que es del hogar, lo personal y lo
  compartido. Los gastos `personal` no afectan el presupuesto familiar.
- **`savings_accounts` ≠ `accounts`**: el primero es la división mental
  del ahorro ("bolsillos"), el segundo es dónde está físicamente la plata.
  Un `savings_account` apunta a un `account` real.
- **`net_worth_snapshots`** se calcula por cron mensual sumando `accounts`
  (activos) y la deuda agregada de tarjetas/préstamos (pasivos). Permite
  graficar la evolución del patrimonio sin recalcular en cada request.

## 2. Autenticación (Supabase Auth)

- Email/password + Google.
- Al crear cuenta se crea un `profile` y, si no recibió invitación, un
  `household` propio + entrada en `household_members` con rol `admin`.
- Invitaciones por mail/link → genera entrada en `household_members` al
  aceptar.

## 3. Row Level Security (RLS)

Cada tabla excepto `profiles` filtra por hogares a los que el usuario
pertenece. Ejemplo para `transactions`:

```sql
alter table transactions enable row level security;

create policy "miembros del hogar pueden leer movimientos"
  on transactions for select
  using (
    exists (
      select 1 from household_members hm
      where hm.household_id = transactions.household_id
        and hm.profile_id = auth.uid()
    )
  );

create policy "miembros del hogar pueden insertar"
  on transactions for insert
  with check (
    exists (
      select 1 from household_members hm
      where hm.household_id = transactions.household_id
        and hm.profile_id = auth.uid()
    )
  );
```

Replicar la política análoga para todas las tablas con `household_id`.

## 4. Storage

- Bucket `documents` con políticas por `household_id`.
- Los archivos viven en `documents/{household_id}/{document_id}.{ext}`.
- La tabla `documents` guarda `storage_path` (no la URL pública).
- Para servirlos al cliente se usan **signed URLs** con expiración corta
  (≤ 60s) generadas desde una Server Action.

## 5. Conexión desde Next.js

- `lib/supabase/server.ts` y `lib/supabase/client.ts` con
  `@supabase/ssr` para Server Components y Client Components.
- Reemplazar cada `lib/mock/*.ts` por funciones tipo:

```ts
export async function getTransactions(householdId: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("transactions")
    .select("*, category:categories(name)")
    .eq("household_id", householdId)
    .order("date", { ascending: false });
  return data ?? [];
}
```

- Mutaciones a través de **Server Actions** (`"use server"`).

## 6. IA real con OpenAI

El motor local de `lib/ai/recommendations.ts` se mantiene como
**heurística determinística** que corre siempre (gratis, rápida, sin red).
Sobre esa base agregamos la capa OpenAI:

1. **Recomendaciones inteligentes**: una vez al día, un cron
   (Vercel Cron / Supabase Edge Function) toma el resumen agregado del
   hogar y llama a `gpt-5` con un prompt estructurado. La respuesta se
   guarda en `ai_recommendations`. El frontend muestra primero las
   guardadas y, si no hay del día, hace fallback al motor local.

2. **Chat "Preguntale a tu hogar"**: route handler
   `app/api/ai/chat/route.ts` con streaming.

```ts
import Anthropic from "@anthropic-ai/sdk"; // o openai
// pasa contexto del hogar (resumen mes, vencimientos, tareas, objetivos)
// como un mensaje system + la pregunta del usuario como user.
```

3. **Escaneo de tickets** (fase posterior): subir imagen → Vision API
   → extraer ítems → sugerir transacciones para confirmar.

### Prompt base (resumen)

```
Sos el copiloto financiero y doméstico de la familia {nombre del hogar}.
Hablás en español rioplatense, claro y empático. Nunca inventás cifras:
solo usás los datos que te paso. Si no tenés info, lo decís.

Datos del mes:
- Ingresos: ...
- Gastos: ...
- Top categorías: ...
- Vencimientos próximos: ...
- Tareas atrasadas: ...
- Objetivos activos: ...

Pregunta del usuario: "{pregunta}"
```

## 7. Variables de entorno necesarias

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # solo server
OPENAI_API_KEY=                     # solo server
```

## 8. Orden sugerido de implementación

1. Supabase + tablas + RLS (incluye accounts, savings_accounts, investments,
   personal_budgets, member_financial_profiles, net_worth_snapshots,
   transaction_members).
2. Auth + onboarding (crear hogar / aceptar invitación + seed de cuentas
   básicas: efectivo, caja de ahorro, billetera virtual).
3. Reemplazo de mocks por queries reales, módulo por módulo. Orden sugerido:
   - `members`, `accounts`, `household` → primero porque son referencia.
   - `transactions` (incluye scope y memberId).
   - `bills`, `goals`, `savings_accounts`, `investments`.
   - `personal_budgets` + filtros por integrante.
   - `tasks`, `shopping`, `maintenance`, `documents`.
4. Mutaciones (Server Actions) para alta/edición de cada entidad.
5. Cron mensual de `net_worth_snapshots` + cron diario de recomendaciones IA.
6. Chat con streaming (server route `app/api/ai/chat`).
7. Storage para documentos.
8. PWA + push (Plus / Familiar).
