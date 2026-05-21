import type { MaintenanceItem } from "@/lib/types";

const today = new Date();
const inDays = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

export const maintenanceItems: MaintenanceItem[] = [
  {
    id: "mn1",
    title: "Service del calefón",
    asset: "Calefón Rheem",
    lastDone: inDays(-380),
    nextDue: inDays(-15),
    intervalMonths: 12,
    status: "atrasado",
    responsible: "Martín",
    notes: "Llamar al servicio técnico autorizado",
  },
  {
    id: "mn2",
    title: "Limpieza filtros aire acondicionado",
    asset: "Split living BGH",
    lastDone: inDays(-90),
    nextDue: inDays(5),
    intervalMonths: 3,
    status: "proximo",
    responsible: "Martín",
  },
  {
    id: "mn3",
    title: "Cambio de aceite del auto",
    asset: "Toyota Etios",
    lastDone: inDays(-150),
    nextDue: inDays(30),
    intervalMonths: 6,
    status: "ok",
    responsible: "Martín",
  },
  {
    id: "mn4",
    title: "Revisión matafuegos",
    asset: "Matafuego ABC cocina",
    lastDone: inDays(-200),
    nextDue: inDays(160),
    intervalMonths: 12,
    status: "ok",
    responsible: "Camila",
  },
  {
    id: "mn5",
    title: "Limpieza tanque de agua",
    asset: "Tanque techo",
    lastDone: inDays(-350),
    nextDue: inDays(15),
    intervalMonths: 12,
    status: "proximo",
    responsible: "Camila",
  },
  {
    id: "mn6",
    title: "Desinfección de colchones",
    asset: "Colchones",
    lastDone: inDays(-220),
    nextDue: inDays(140),
    intervalMonths: 12,
    status: "ok",
  },
];
