import type { HouseholdTask } from "@/lib/types";

const today = new Date();
const inDays = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

export const tasks: HouseholdTask[] = [
  {
    id: "ht1",
    title: "Pagar expensas del mes",
    status: "pendiente",
    priority: "alta",
    dueDate: inDays(2),
    responsible: "Camila",
    area: "pagos",
  },
  {
    id: "ht2",
    title: "Limpiar filtro del aire acondicionado",
    description: "Sacar filtros, lavar con agua tibia y dejar secar",
    status: "pendiente",
    priority: "media",
    dueDate: inDays(5),
    responsible: "Martín",
    area: "mantenimiento",
  },
  {
    id: "ht3",
    title: "Comprar productos de limpieza",
    status: "pendiente",
    priority: "media",
    dueDate: inDays(1),
    responsible: "Camila",
    area: "compras",
  },
  {
    id: "ht4",
    title: "Revisar seguro del auto",
    description: "Comparar con otras aseguradoras antes de renovar",
    status: "en-progreso",
    priority: "media",
    dueDate: inDays(8),
    responsible: "Martín",
    area: "general",
  },
  {
    id: "ht5",
    title: "Service del calefón",
    status: "pendiente",
    priority: "alta",
    dueDate: inDays(-3),
    responsible: "Martín",
    area: "mantenimiento",
  },
  {
    id: "ht6",
    title: "Sacar turno odontólogo Lucía",
    status: "pendiente",
    priority: "baja",
    dueDate: inDays(10),
    responsible: "Camila",
    area: "general",
  },
  {
    id: "ht7",
    title: "Lavar sábanas y toallas",
    status: "completado",
    priority: "baja",
    dueDate: inDays(-1),
    responsible: "Camila",
    area: "limpieza",
  },
  {
    id: "ht8",
    title: "Cambiar filtro de la pava eléctrica",
    status: "pendiente",
    priority: "baja",
    dueDate: inDays(14),
    responsible: "Lucía",
    area: "mantenimiento",
  },
  {
    id: "ht9",
    title: "Reservar parrilla del SUM",
    status: "completado",
    priority: "baja",
    dueDate: inDays(-2),
    responsible: "Martín",
    area: "general",
  },
];
