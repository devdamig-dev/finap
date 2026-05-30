import type { PlannedPurchase } from "@/lib/types";

const today = new Date();
const inDays = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

/**
 * Compras previstas del hogar — bloques de compra, no items individuales.
 * En el uso real la familia no carga "leche, pan, detergente": piensa en
 * "supermercado semanal", "farmacia del mes", "compra escolar".
 */
export const plannedPurchases: PlannedPurchase[] = [
  {
    id: "pp1",
    title: "Supermercado semanal",
    category: "Supermercado",
    estimatedAmount: 60000,
    plannedDate: inDays(0),
    responsible: "Camila",
    status: "prevista",
    notes: "Coto o Día, lo que cierre mejor.",
  },
  {
    id: "pp2",
    title: "Reposición limpieza",
    category: "Limpieza",
    estimatedAmount: 35000,
    plannedDate: inDays(3),
    responsible: "Martín",
    status: "prevista",
  },
  {
    id: "pp3",
    title: "Farmacia del mes",
    category: "Farmacia",
    estimatedAmount: 18000,
    plannedDate: inDays(5),
    responsible: "Camila",
    status: "prevista",
    notes: "Medicación crónica + protector solar.",
  },
  {
    id: "pp4",
    title: "Alimento mascota",
    category: "Mascotas",
    estimatedAmount: 22000,
    plannedDate: inDays(7),
    responsible: "Martín",
    status: "prevista",
  },
  {
    id: "pp5",
    title: "Compra mensual del hogar",
    category: "Hogar",
    estimatedAmount: 90000,
    plannedDate: inDays(10),
    responsible: "Camila",
    status: "prevista",
    notes: "Reposición grande: almacén + bazar.",
  },
  {
    id: "pp6",
    title: "Compra escolar de Lucía",
    category: "Escolar",
    estimatedAmount: 45000,
    plannedDate: inDays(14),
    responsible: "Camila",
    status: "prevista",
  },
  {
    id: "pp7",
    title: "Supermercado semana pasada",
    category: "Supermercado",
    estimatedAmount: 58000,
    plannedDate: inDays(-6),
    responsible: "Martín",
    status: "realizada",
    notes: "Salió un poco más por las frutas.",
  },
];
