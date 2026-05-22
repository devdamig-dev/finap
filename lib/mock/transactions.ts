import type { Subscription, Transaction } from "@/lib/types";
import { personalExpenses } from "@/lib/mock/personal-expenses";

const today = new Date();
const y = today.getFullYear();
const m = today.getMonth();

const d = (day: number) => new Date(y, m, day).toISOString();

/**
 * Movimientos del hogar (no personales).
 * Mantienen `scope: "hogar"` por defecto.
 * Algunos gastos compartidos quedan marcados como `scope: "compartido"`.
 */
export const householdTransactions: Transaction[] = [
  // Ingresos
  { id: "t1", type: "ingreso", category: "Sueldo", description: "Sueldo Camila", amount: 950000, date: d(1), account: "Banco Galicia", accountId: "a2", recurring: true, isRecurring: true, scope: "hogar", memberId: "m1" },
  { id: "t2", type: "ingreso", category: "Sueldo", description: "Sueldo Martín", amount: 720000, date: d(5), account: "Banco Santander", accountId: "a3", recurring: true, isRecurring: true, scope: "hogar", memberId: "m2" },
  { id: "t3", type: "ingreso", category: "Freelance", description: "Proyecto diseño", amount: 180000, date: d(12), account: "Mercado Pago", accountId: "a4", scope: "hogar", memberId: "m1" },

  // Gastos fijos del hogar
  { id: "t4", type: "gasto", kind: "fijo", category: "Alquiler", description: "Alquiler departamento", amount: 380000, date: d(3), recurring: true, isRecurring: true, scope: "hogar", paymentMethod: "transferencia" },
  { id: "t5", type: "gasto", kind: "fijo", category: "Expensas", description: "Expensas mes", amount: 95000, date: d(8), recurring: true, isRecurring: true, scope: "hogar", paymentMethod: "debito" },
  { id: "t6", type: "gasto", kind: "fijo", category: "Internet", description: "Fibertel", amount: 28000, date: d(7), recurring: true, isRecurring: true, scope: "hogar", paymentMethod: "debito" },
  { id: "t7", type: "gasto", kind: "fijo", category: "Celular", description: "Personal — 2 líneas", amount: 24000, date: d(10), recurring: true, isRecurring: true, scope: "hogar", paymentMethod: "debito" },
  { id: "t8", type: "gasto", kind: "fijo", category: "Seguros", description: "Seguro auto", amount: 38000, date: d(15), recurring: true, isRecurring: true, scope: "hogar", paymentMethod: "debito" },
  { id: "t9", type: "gasto", kind: "fijo", category: "Servicios", description: "Edesur", amount: 32000, date: d(11), recurring: true, isRecurring: true, scope: "hogar", paymentMethod: "debito" },
  { id: "t10", type: "gasto", kind: "fijo", category: "Servicios", description: "Metrogas", amount: 18000, date: d(11), recurring: true, isRecurring: true, scope: "hogar", paymentMethod: "debito" },
  { id: "t11", type: "gasto", kind: "fijo", category: "Servicios", description: "AySA", amount: 9500, date: d(11), recurring: true, isRecurring: true, scope: "hogar", paymentMethod: "debito" },
  { id: "t12", type: "gasto", kind: "fijo", category: "Salud", description: "OSDE familiar", amount: 165000, date: d(4), recurring: true, isRecurring: true, scope: "hogar", paymentMethod: "debito" },
  { id: "t13", type: "gasto", kind: "fijo", category: "Educación", description: "Colegio Lucía", amount: 95000, date: d(6), recurring: true, isRecurring: true, scope: "hogar", paymentMethod: "transferencia" },

  // Gastos variables del hogar / compartidos
  { id: "t14", type: "gasto", kind: "variable", category: "Supermercado", description: "Coto", amount: 48000, date: d(2), scope: "compartido", paymentMethod: "credito" },
  { id: "t15", type: "gasto", kind: "variable", category: "Supermercado", description: "Día — completar", amount: 22000, date: d(9), scope: "compartido", paymentMethod: "debito" },
  { id: "t16", type: "gasto", kind: "variable", category: "Supermercado", description: "Verdulería barrio", amount: 12000, date: d(14), scope: "compartido", paymentMethod: "efectivo" },
  { id: "t17", type: "gasto", kind: "variable", category: "Delivery", description: "Pedidos Ya — sushi", amount: 18500, date: d(6), scope: "compartido", paymentMethod: "credito" },
  { id: "t18", type: "gasto", kind: "variable", category: "Delivery", description: "Rappi — pizzería", amount: 12800, date: d(10), scope: "compartido", paymentMethod: "credito" },
  { id: "t19", type: "gasto", kind: "variable", category: "Delivery", description: "Pedidos Ya — empanadas", amount: 9400, date: d(13), scope: "compartido", paymentMethod: "credito" },
  { id: "t20", type: "gasto", kind: "variable", category: "Delivery", description: "Rappi — desayuno", amount: 8200, date: d(16), scope: "compartido", paymentMethod: "credito" },
  { id: "t21", type: "gasto", kind: "variable", category: "Transporte", description: "SUBE recarga", amount: 9000, date: d(2), scope: "hogar", paymentMethod: "debito" },
  { id: "t22", type: "gasto", kind: "variable", category: "Transporte", description: "YPF — nafta", amount: 35000, date: d(8), scope: "hogar", paymentMethod: "credito" },
  { id: "t23", type: "gasto", kind: "variable", category: "Transporte", description: "Uber centro", amount: 6500, date: d(12), scope: "hogar", paymentMethod: "credito" },
  { id: "t24", type: "gasto", kind: "variable", category: "Entretenimiento", description: "Cine familia", amount: 14000, date: d(7), scope: "compartido", paymentMethod: "credito" },
  { id: "t25", type: "gasto", kind: "variable", category: "Hogar", description: "Productos de limpieza", amount: 9800, date: d(5), scope: "hogar", paymentMethod: "debito" },
  { id: "t26", type: "gasto", kind: "variable", category: "Tarjeta", description: "Visa — resumen", amount: 142000, date: d(11), scope: "hogar", paymentMethod: "debito" },
  { id: "t27", type: "gasto", kind: "variable", category: "Suscripciones", description: "Netflix", amount: 6500, date: d(4), recurring: true, isRecurring: true, scope: "compartido", paymentMethod: "credito" },
  { id: "t28", type: "gasto", kind: "variable", category: "Suscripciones", description: "Spotify familiar", amount: 5200, date: d(6), recurring: true, isRecurring: true, scope: "compartido", paymentMethod: "credito" },
  { id: "t29", type: "gasto", kind: "variable", category: "Suscripciones", description: "HBO Max", amount: 4800, date: d(9), recurring: true, isRecurring: true, scope: "compartido", paymentMethod: "credito" },
  { id: "t30", type: "gasto", kind: "variable", category: "Salud", description: "Farmacia", amount: 15600, date: d(13), scope: "hogar", paymentMethod: "debito" },

  // Ahorro e inversión del mes
  { id: "t31", type: "ahorro", category: "Ahorro", description: "Aporte fondo de emergencia", amount: 150000, date: d(5), accountId: "a3", scope: "hogar", linkedGoalId: "g1", paymentMethod: "transferencia", isRecurring: true, recurring: true },
  { id: "t32", type: "ahorro", category: "Ahorro", description: "Aporte vacaciones Bariloche", amount: 80000, date: d(8), accountId: "a4", scope: "hogar", linkedGoalId: "g2", paymentMethod: "transferencia" },
  { id: "t33", type: "inversion", category: "Inversión", description: "Suscripción FCI conservador", amount: 130000, date: d(10), accountId: "a6", scope: "hogar", paymentMethod: "transferencia" },
];

/**
 * Vista unificada: hogar + personales. La mayoría de pantallas trabajan
 * con esta lista; cuando hace falta separar, se filtra por `scope`.
 */
export const transactions: Transaction[] = [...householdTransactions, ...personalExpenses];

export const subscriptions: Subscription[] = [
  { id: "s1", name: "Netflix", amount: 6500, category: "Suscripciones", renewsAt: d(4) },
  { id: "s2", name: "Spotify familiar", amount: 5200, category: "Suscripciones", renewsAt: d(6) },
  { id: "s3", name: "HBO Max", amount: 4800, category: "Suscripciones", renewsAt: d(9) },
];
