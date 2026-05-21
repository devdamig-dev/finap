# HogarIA

App SaaS/PWA tipo copiloto del hogar: administración de finanzas
familiares, vencimientos, tareas domésticas, compras, mantenimiento,
documentos y objetivos, con recomendaciones de IA.

> Esta es la **Fase 1 — MVP frontend con datos mockeados**. No hay
> backend ni IA real conectada todavía. Toda la capa de datos pasa por
> `lib/mock/*` y `lib/ai/recommendations.ts`.

## Stack

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS + shadcn-style (componentes propios con Radix UI)
- lucide-react para íconos
- recharts para gráficos
- Mobile-first con bottom nav + sidebar en desktop

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) — redirige a
`/dashboard`.

Scripts:

- `npm run dev` — servidor local
- `npm run build` — build de producción
- `npm run start` — sirve el build
- `npm run typecheck` — chequeo de tipos
- `npm run lint` — eslint

## Estructura

```
app/
  dashboard/
    page.tsx                 Inicio
    finanzas/page.tsx
    hogar/page.tsx
    calendario/page.tsx
    ia/page.tsx
    configuracion/page.tsx
components/
  app/                       AppShell, navegación, header, CTA flotante
  dashboard/                 Cards del home
  finance/                   Listas, presupuesto, tarjetas, alertas
  household/                 Tareas, compras, mantenimiento, documentos
  calendar/                  Agenda agrupada por día
  ai/                        Chat "Preguntale a tu hogar"
  ui/                        Primitivas (Button, Card, Badge, etc.)
lib/
  mock/                      Datos mockeados (transactions, bills, …)
  ai/recommendations.ts      Motor local de recomendaciones
  types.ts                   Tipos compartidos
  utils.ts                   Formato de moneda, fechas, helpers
docs/
  backend-plan.md            Modelo Supabase + RLS + OpenAI
  product-roadmap.md         Fases hasta monetización
```

## Próximos pasos

Ver `docs/backend-plan.md` y `docs/product-roadmap.md`.
