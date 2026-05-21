# HogarIA — Roadmap de producto

Plan de fases para llevar HogarIA desde el MVP frontend hasta un producto
con monetización y capacidades inteligentes.

## Fase 1 · MVP frontend + mock data (actual)

**Objetivo**: validar look & feel, navegación y propuesta de valor.

- Next.js App Router + Tailwind + shadcn-style.
- 6 módulos: Dashboard, Finanzas, Hogar, Calendario, IA, Configuración.
- Datos mock realistas en `lib/mock/*`.
- Motor local de recomendaciones (`lib/ai/recommendations.ts`).
- Chat IA simulado con respuestas basadas en heurísticas.
- Mobile-first con bottom nav, desktop con sidebar.
- Componentes reutilizables y tipados.

## Fase 2 · Supabase real

**Objetivo**: persistencia, multiusuario y hogares compartidos.

- Auth (email/password + Google).
- Modelo de datos completo (ver `docs/backend-plan.md`).
- RLS por hogar.
- Onboarding: crear hogar, invitar integrantes.
- Reemplazo de mocks por queries reales.
- Server Actions para todas las mutaciones.
- Importación inicial: CSV de movimientos.

Entregable: aplicación usable de punta a punta con datos reales.

## Fase 3 · IA real con OpenAI / Claude

**Objetivo**: recomendaciones de verdad y chat inteligente.

- Pipeline diario: resumen del hogar → modelo → `ai_recommendations`.
- Chat "Preguntale a tu hogar" con streaming.
- Fallback al motor local para tareas determinísticas (cálculo de
  presupuestos, vencimientos próximos, etc.).
- Sistema de feedback: 👍 / 👎 en cada recomendación para mejorar
  prompts.

## Fase 4 · PWA + notificaciones

**Objetivo**: que HogarIA viva en el teléfono.

- Manifest + service worker + offline básico.
- Instalable desde Android e iOS.
- Web Push:
  - Recordatorios de vencimientos (24h y 2h antes).
  - Alertas de presupuesto excedido.
  - Tareas asignadas a un integrante.
- Resumen semanal por email.
- Integración opcional con WhatsApp (notificaciones).

## Fase 5 · Escaneo de tickets y documentos

**Objetivo**: cargar gastos sin tipear.

- Cámara → foto del ticket → modelo de visión extrae:
  - Comercio
  - Fecha
  - Ítems y precios
  - Total
- Cargar transacción precompletada lista para confirmar.
- Carga de documentos del hogar con OCR (vencimientos, pólizas).
- Recordatorios automáticos por vencimiento de documento.

## Fase 6 · Planes pagos y monetización

**Objetivo**: convertir HogarIA en un negocio sostenible.

| Plan        | Precio (AR$) | Incluye                                                    |
| ----------- | ------------ | ---------------------------------------------------------- |
| Gratis      | $0           | Hasta 3 integrantes, motor local, exportes básicos         |
| Plus        | $3.990/mes   | IA real ilimitada, notificaciones, escaneo de tickets      |
| Familiar    | $6.990/mes   | Plus + hasta 8 integrantes + múltiples hogares + soporte   |

- Paywall en features premium.
- Trial de 14 días al primer alta.
- Stripe / Mercado Pago para cobro recurrente.
- Métricas: activación, retención, ARPU, churn.

## Más adelante

- Open Banking (CBU/CVU agregados, sincronización de movimientos).
- Tarjetas físicas/virtuales del hogar.
- Marketplace de servicios (seguros, energía, internet) con
  comparador y comisión.
- Coach de inversiones simple (FCI, dólar MEP, plazo fijo).
