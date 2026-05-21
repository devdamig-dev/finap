import type { Subscription, Transaction } from "@/lib/types";

const today = new Date();
const y = today.getFullYear();
const m = today.getMonth();

const d = (day: number) => new Date(y, m, day).toISOString();

export const transactions: Transaction[] = [
  // Ingresos
  { id: "t1", type: "ingreso", category: "Sueldo", description: "Sueldo Camila", amount: 950000, date: d(1), account: "Banco Galicia", recurring: true },
  { id: "t2", type: "ingreso", category: "Sueldo", description: "Sueldo Martín", amount: 720000, date: d(5), account: "Banco Santander", recurring: true },
  { id: "t3", type: "ingreso", category: "Freelance", description: "Proyecto diseño", amount: 180000, date: d(12), account: "Mercado Pago" },

  // Gastos fijos
  { id: "t4", type: "gasto", kind: "fijo", category: "Alquiler", description: "Alquiler departamento", amount: 380000, date: d(3), recurring: true },
  { id: "t5", type: "gasto", kind: "fijo", category: "Expensas", description: "Expensas mes", amount: 95000, date: d(8), recurring: true },
  { id: "t6", type: "gasto", kind: "fijo", category: "Internet", description: "Fibertel", amount: 28000, date: d(7), recurring: true },
  { id: "t7", type: "gasto", kind: "fijo", category: "Celular", description: "Personal — 2 líneas", amount: 24000, date: d(10), recurring: true },
  { id: "t8", type: "gasto", kind: "fijo", category: "Seguros", description: "Seguro auto", amount: 38000, date: d(15), recurring: true },
  { id: "t9", type: "gasto", kind: "fijo", category: "Servicios", description: "Edesur", amount: 32000, date: d(11), recurring: true },
  { id: "t10", type: "gasto", kind: "fijo", category: "Servicios", description: "Metrogas", amount: 18000, date: d(11), recurring: true },
  { id: "t11", type: "gasto", kind: "fijo", category: "Servicios", description: "AySA", amount: 9500, date: d(11), recurring: true },
  { id: "t12", type: "gasto", kind: "fijo", category: "Salud", description: "OSDE familiar", amount: 165000, date: d(4), recurring: true },
  { id: "t13", type: "gasto", kind: "fijo", category: "Educación", description: "Colegio Lucía", amount: 95000, date: d(6), recurring: true },

  // Gastos variables
  { id: "t14", type: "gasto", kind: "variable", category: "Supermercado", description: "Coto", amount: 48000, date: d(2) },
  { id: "t15", type: "gasto", kind: "variable", category: "Supermercado", description: "Día — completar", amount: 22000, date: d(9) },
  { id: "t16", type: "gasto", kind: "variable", category: "Supermercado", description: "Verdulería barrio", amount: 12000, date: d(14) },
  { id: "t17", type: "gasto", kind: "variable", category: "Delivery", description: "Pedidos Ya — sushi", amount: 18500, date: d(6) },
  { id: "t18", type: "gasto", kind: "variable", category: "Delivery", description: "Rappi — pizzería", amount: 12800, date: d(10) },
  { id: "t19", type: "gasto", kind: "variable", category: "Delivery", description: "Pedidos Ya — empanadas", amount: 9400, date: d(13) },
  { id: "t20", type: "gasto", kind: "variable", category: "Delivery", description: "Rappi — desayuno", amount: 8200, date: d(16) },
  { id: "t21", type: "gasto", kind: "variable", category: "Transporte", description: "SUBE recarga", amount: 9000, date: d(2) },
  { id: "t22", type: "gasto", kind: "variable", category: "Transporte", description: "YPF — nafta", amount: 35000, date: d(8) },
  { id: "t23", type: "gasto", kind: "variable", category: "Transporte", description: "Uber centro", amount: 6500, date: d(12) },
  { id: "t24", type: "gasto", kind: "variable", category: "Entretenimiento", description: "Cine familia", amount: 14000, date: d(7) },
  { id: "t25", type: "gasto", kind: "variable", category: "Hogar", description: "Productos de limpieza", amount: 9800, date: d(5) },
  { id: "t26", type: "gasto", kind: "variable", category: "Tarjeta", description: "Visa — resumen", amount: 142000, date: d(11) },
  { id: "t27", type: "gasto", kind: "variable", category: "Suscripciones", description: "Netflix", amount: 6500, date: d(4), recurring: true },
  { id: "t28", type: "gasto", kind: "variable", category: "Suscripciones", description: "Spotify familiar", amount: 5200, date: d(6), recurring: true },
  { id: "t29", type: "gasto", kind: "variable", category: "Suscripciones", description: "HBO Max", amount: 4800, date: d(9), recurring: true },
  { id: "t30", type: "gasto", kind: "variable", category: "Salud", description: "Farmacia", amount: 15600, date: d(13) },
];

export const subscriptions: Subscription[] = [
  { id: "s1", name: "Netflix", amount: 6500, category: "Suscripciones", renewsAt: d(4) },
  { id: "s2", name: "Spotify familiar", amount: 5200, category: "Suscripciones", renewsAt: d(6) },
  { id: "s3", name: "HBO Max", amount: 4800, category: "Suscripciones", renewsAt: d(9) },
];
