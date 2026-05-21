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
  type text check (type in ('ingreso','gasto')) not null,
  expense_kind text check (expense_kind in ('fijo','variable')),
  category_id uuid references categories on delete set null,
  description text,
  amount numeric(14,2) not null,
  date date not null,
  account text,
  recurring boolean default false,
  created_at timestamptz default now()
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

-- Recomendaciones generadas por la IA
ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households on delete cascade,
  level text check (level in ('info','positivo','atencion','alerta')),
  module text,
  title text not null,
  description text,
  action_label text,
  action_href text,
  created_at timestamptz default now(),
  dismissed_at timestamptz
);

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

1. Supabase + tablas + RLS.
2. Auth + onboarding (crear hogar / aceptar invitación).
3. Reemplazo de mocks por queries reales (módulo por módulo).
4. Mutaciones (Server Actions).
5. Cron de recomendaciones IA.
6. Chat con streaming.
7. Storage para documentos.
8. PWA + push.
