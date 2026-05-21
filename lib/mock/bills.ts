import type { Bill } from "@/lib/types";

const today = new Date();
const inDays = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

export const bills: Bill[] = [
  { id: "b1", title: "Expensas edificio", category: "Expensas", amount: 95000, dueDate: inDays(2), status: "proximo", responsible: "Camila" },
  { id: "b2", title: "Edesur — Electricidad", category: "Servicios", amount: 32000, dueDate: inDays(4), status: "proximo", responsible: "Martín" },
  { id: "b3", title: "Metrogas", category: "Servicios", amount: 18000, dueDate: inDays(4), status: "proximo", responsible: "Martín" },
  { id: "b4", title: "Internet — Fibertel", category: "Internet", amount: 28000, dueDate: inDays(6), status: "proximo", autoDebit: true },
  { id: "b5", title: "OSDE — Plan familiar", category: "Salud", amount: 165000, dueDate: inDays(7), status: "pendiente", responsible: "Camila" },
  { id: "b6", title: "Seguro auto — La Caja", category: "Seguros", amount: 38000, dueDate: inDays(10), status: "pendiente", autoDebit: true },
  { id: "b7", title: "Colegio Lucía", category: "Educación", amount: 95000, dueDate: inDays(12), status: "pendiente", responsible: "Camila" },
  { id: "b8", title: "Visa — Resumen tarjeta", category: "Tarjeta", amount: 142000, dueDate: inDays(14), status: "pendiente", responsible: "Martín" },
  { id: "b9", title: "AySA — Agua", category: "Servicios", amount: 9500, dueDate: inDays(-3), status: "vencido", responsible: "Martín" },
  { id: "b10", title: "Alquiler", category: "Alquiler", amount: 380000, dueDate: inDays(-9), status: "pagado", responsible: "Camila" },
];
