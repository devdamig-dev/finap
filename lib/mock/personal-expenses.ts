import type { Transaction } from "@/lib/types";

const today = new Date();
const y = today.getFullYear();
const m = today.getMonth();
const d = (day: number) => new Date(y, m, day).toISOString();

/**
 * Gastos personales de los integrantes del hogar.
 * Cada movimiento tiene `scope: "personal"` y `memberId`, lo que permite
 * separar el presupuesto familiar de lo que gasta cada uno.
 */
export const personalExpenses: Transaction[] = [
  // Camila (m1)
  { id: "pe1", type: "gasto", kind: "variable", category: "Peluquería", description: "Color y corte", amount: 18000, date: d(3), scope: "personal", memberId: "m1", paymentMethod: "debito" },
  { id: "pe2", type: "gasto", kind: "variable", category: "Gimnasio", description: "Mensualidad gym", amount: 14000, date: d(5), scope: "personal", memberId: "m1", paymentMethod: "debito", isRecurring: true, recurring: true },
  { id: "pe3", type: "gasto", kind: "variable", category: "Ropa", description: "Zapatillas", amount: 32000, date: d(9), scope: "personal", memberId: "m1", paymentMethod: "credito" },
  { id: "pe4", type: "gasto", kind: "variable", category: "Salidas", description: "Cena con amigas", amount: 22000, date: d(11), scope: "personal", memberId: "m1", paymentMethod: "credito" },
  { id: "pe5", type: "gasto", kind: "variable", category: "Cafetería", description: "Cafés de la semana", amount: 9800, date: d(13), scope: "personal", memberId: "m1", paymentMethod: "debito" },
  { id: "pe6", type: "gasto", kind: "variable", category: "Hobbies", description: "Materiales cerámica", amount: 7400, date: d(14), scope: "personal", memberId: "m1", paymentMethod: "efectivo" },

  // Martín (m2)
  { id: "pe7", type: "gasto", kind: "variable", category: "Gimnasio", description: "Cuota gym", amount: 16000, date: d(4), scope: "personal", memberId: "m2", paymentMethod: "debito", isRecurring: true, recurring: true },
  { id: "pe8", type: "gasto", kind: "variable", category: "Deportes", description: "Pádel x 4 horas", amount: 22000, date: d(7), scope: "personal", memberId: "m2", paymentMethod: "transferencia" },
  { id: "pe9", type: "gasto", kind: "variable", category: "Deportes", description: "Zapatillas running", amount: 28000, date: d(10), scope: "personal", memberId: "m2", paymentMethod: "credito" },
  { id: "pe10", type: "gasto", kind: "variable", category: "Salidas", description: "Asado con amigos", amount: 9500, date: d(12), scope: "personal", memberId: "m2", paymentMethod: "efectivo" },
  { id: "pe11", type: "gasto", kind: "variable", category: "Cafetería", description: "Cafés trabajo", amount: 8200, date: d(14), scope: "personal", memberId: "m2", paymentMethod: "debito" },
  { id: "pe12", type: "gasto", kind: "variable", category: "Apps personales", description: "Notion + iCloud", amount: 5400, date: d(8), scope: "personal", memberId: "m2", paymentMethod: "credito", isRecurring: true, recurring: true },

  // Lucía (m3)
  { id: "pe13", type: "gasto", kind: "variable", category: "Cursos", description: "Inglés online", amount: 12000, date: d(6), scope: "personal", memberId: "m3", paymentMethod: "transferencia", isRecurring: true, recurring: true },
  { id: "pe14", type: "gasto", kind: "variable", category: "Salidas", description: "Cumple Tomi", amount: 5200, date: d(11), scope: "personal", memberId: "m3", paymentMethod: "efectivo" },
  { id: "pe15", type: "gasto", kind: "variable", category: "Hobbies", description: "Libros y útiles", amount: 4800, date: d(13), scope: "personal", memberId: "m3", paymentMethod: "efectivo" },
];

export function getPersonalExpensesByMember(memberId: string): Transaction[] {
  return personalExpenses.filter((t) => t.memberId === memberId);
}

export function getPersonalSpentByMember(memberId: string): number {
  return getPersonalExpensesByMember(memberId).reduce((acc, t) => acc + t.amount, 0);
}
