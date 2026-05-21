import type { Goal } from "@/lib/types";

const inMonths = (n: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() + n);
  return d.toISOString();
};

export const goals: Goal[] = [
  {
    id: "g1",
    title: "Fondo de emergencia",
    target: 3000000,
    saved: 1450000,
    monthlyContribution: 150000,
    deadline: inMonths(10),
    status: "al-dia",
    emoji: "🛟",
  },
  {
    id: "g2",
    title: "Vacaciones en Bariloche",
    target: 1200000,
    saved: 420000,
    monthlyContribution: 100000,
    deadline: inMonths(5),
    status: "atrasado",
    emoji: "🏔️",
  },
  {
    id: "g3",
    title: "Arreglos del hogar",
    target: 800000,
    saved: 320000,
    monthlyContribution: 60000,
    deadline: inMonths(8),
    status: "al-dia",
    emoji: "🛠️",
  },
  {
    id: "g4",
    title: "Cambiar la heladera",
    target: 950000,
    saved: 95000,
    monthlyContribution: 50000,
    deadline: inMonths(12),
    status: "atrasado",
    emoji: "🧊",
  },
];
