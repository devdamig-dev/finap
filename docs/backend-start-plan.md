# HogarIA — Sprint Backend 1

Plan operativo para arrancar el backend real. **Sin IA en este sprint:**
primero persistencia, permisos y CRUD. OpenAI / Claude entran en un
sprint posterior, cuando los datos ya estén estables.

> Este documento es complementario a `docs/backend-plan.md`, que
> describe el modelo de datos completo. Acá nos enfocamos en qué
> entregamos en el primer sprint y en qué orden.

## Objetivo del sprint

Dejar la app funcionando con **datos reales en Supabase** para un único
hogar (multi-usuario dentro de ese hogar). Cuando Supabase no está
configurado, mantener el fallback a mock + localStorage que ya funciona
hoy.

## Stack

- **Supabase** (Postgres + Auth + Storage + RLS)
- **Next.js 14 App Router** (Server Components + Server Actions)
- **@supabase/ssr** para auth y queries SSR
- **Zod** para validación de inputs de Server Actions (a sumar al
  package.json en este sprint)

## Alcance

### 1. Setup

- [ ] Crear proyecto Supabase (`hogaria-dev`).
- [ ] Variables de entorno en Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- [ ] Migraciones versionadas en `supabase/migrations/`.
- [ ] Helpers `lib/supabase/server.ts` y `lib/supabase/client.ts`.

### 2. Tablas (en este orden)

Cada migración es un archivo timestamp en `supabase/migrations/`.

1. `households`
2. `profiles` (extiende `auth.users`)
3. `household_members` (n a n, con role `admin` | `member` | `guest`)
4. `accounts` (cuentas y bolsillos del hogar)
5. `categories` (globales del hogar)
6. `transactions`
7. `bills`
8. `tasks`
9. `planned_purchases` (compras previstas — reemplaza el shopping antiguo)
10. `goals`
11. `documents` (metadata; los archivos van a Storage)
12. `member_financial_profiles` (preferencia + flags de privacidad por
    integrante)

Las tablas extra documentadas en `backend-plan.md` (`savings_accounts`,
`investments`, `personal_budgets`, `net_worth_snapshots`,
`ai_recommendations`, `transaction_members`) **quedan para sprints
siguientes** — el MVP local trabaja con seed mock.

### 3. Auth

- Email + password como mínimo viable.
- Google OAuth como segundo proveedor.
- Trigger `on auth.user.created`: crear `profile` + `household` propio
  + entrada en `household_members` con rol `admin`.

### 4. RLS

Política base, replicada en cada tabla con `household_id`:

```sql
alter table <tabla> enable row level security;

create policy "miembros leen del hogar"
  on <tabla> for select
  using (
    exists (
      select 1 from household_members hm
      where hm.household_id = <tabla>.household_id
        and hm.profile_id = auth.uid()
    )
  );

create policy "miembros escriben en el hogar"
  on <tabla> for insert with check (
    exists (
      select 1 from household_members hm
      where hm.household_id = <tabla>.household_id
        and hm.profile_id = auth.uid()
    )
  );

-- update y delete con el mismo patrón
```

**Privacidad de gastos personales** (clave del producto):

```sql
-- transactions con scope='personal' sólo las ve el dueño o el admin
-- si member_financial_profiles.show_personal_to_household = true
create policy "personales privados por defecto"
  on transactions for select
  using (
    scope != 'personal'
    or member_id = auth.uid()
    or exists (
      select 1
      from household_members hm
      join member_financial_profiles mfp
        on mfp.profile_id = transactions.member_id
      where hm.household_id = transactions.household_id
        and hm.profile_id = auth.uid()
        and hm.role = 'admin'
        and mfp.show_personal_to_household = true
    )
  );
```

### 5. Server Actions / Service layer

Crear `lib/server/<entidad>.ts` con funciones puras que aceptan
`SupabaseClient` y devuelven datos tipados. Cada page Server Component
hace `getX(supabase, householdId)` y pasa el resultado al provider del
cliente.

Mutaciones como Server Actions en `app/actions/`:

- `app/actions/transactions.ts` → `addTransaction(input)`
- `app/actions/bills.ts` → `addBill(input)`, `payBill(id)`
- `app/actions/tasks.ts` → `addTask(input)`, `toggleTask(id)`
- `app/actions/purchases.ts` → `addPurchase(input)`,
  `completePurchase(id)` (crea transacción asociada, igual que hoy),
  `cancelPurchase(id)`
- `app/actions/accounts.ts` → `addAccount(input)`
- `app/actions/documents.ts` → `uploadDocument(input)`
- `app/actions/privacy.ts` → `updatePrivacy(input)`

Cada Server Action valida con Zod antes de tocar la DB.

### 6. Fallback mock / localStorage

Mientras `NEXT_PUBLIC_SUPABASE_URL` no esté seteado, la app sigue
funcionando con el store actual (`lib/store/app-store.tsx`). Eso permite:

- Vista previa pública en Vercel sin credenciales.
- Demo offline en presentaciones.
- Desarrollo local sin tener que correr Supabase.

Bandera de feature:

```ts
// lib/server/mode.ts
export const SUPABASE_ENABLED = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
```

En cada page Server Component:

```ts
const data = SUPABASE_ENABLED
  ? await getTransactionsServer(supabase, householdId)
  : null; // → el AppStoreProvider hidrata del seed + localStorage
```

### 7. Storage

- Bucket `documents` con políticas por `household_id`.
- Path: `documents/{household_id}/{document_id}.{ext}`.
- Server Action `uploadDocument` recibe un `FormData`, sube a Storage,
  guarda metadata en `documents`.
- Para servir al cliente: signed URLs con expiración corta (≤ 60s)
  generadas desde Server Action.

### 8. Migración del store actual

El `useAppStore()` actual se mantiene como **fuente de verdad del cliente**.
Cambia sólo la inicialización:

- Si Supabase está activo: `<AppStoreProvider initialState={fromServer}>`.
- Si no: usa el seed mock como hoy.

Cada `addX` del store dispara la Server Action correspondiente (sin
esperar respuesta para el optimistic update). En error, revierte el
estado y muestra toast.

## Fuera de alcance (sprints siguientes)

- IA real (OpenAI / Claude) — sprint dedicado posterior.
- Cron de `net_worth_snapshots`.
- Cron de recomendaciones IA.
- PWA + push.
- Stripe / Mercado Pago.
- Open Banking.

## Criterios de aceptación del sprint

- [ ] Un usuario puede registrarse, crear hogar, invitar otro
      integrante y entre los dos cargar movimientos / tareas /
      vencimientos / compras previstas.
- [ ] Los datos persisten en Supabase y se ven entre dispositivos.
- [ ] Las políticas RLS impiden que un usuario vea datos de un hogar
      al que no pertenece.
- [ ] Marcar una compra prevista como realizada crea el movimiento
      asociado en `transactions`.
- [ ] Los gastos `scope='personal'` quedan ocultos para el resto del
      hogar excepto que el toggle de privacidad lo permita.
- [ ] La app sigue funcionando sin Supabase configurado (fallback mock).
- [ ] Build sin errores. Lighthouse mobile ≥ 90.
