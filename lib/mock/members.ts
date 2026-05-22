import type { HouseholdMember, PersonalBudget, FinancialProfile } from "@/lib/types";

export const members: HouseholdMember[] = [
  {
    id: "m1",
    name: "Camila",
    role: "Administrador",
    avatarColor: "#0d9488",
    initials: "CM",
    personalBudget: 90000,
    financialProfile: "equilibrado",
  },
  {
    id: "m2",
    name: "Martín",
    role: "Miembro",
    avatarColor: "#0f766e",
    initials: "MR",
    personalBudget: 75000,
    financialProfile: "conservador",
  },
  {
    id: "m3",
    name: "Lucía",
    role: "Miembro",
    avatarColor: "#65a30d",
    initials: "LU",
    personalBudget: 25000,
    financialProfile: "conservador",
  },
];

export const personalBudgets: PersonalBudget[] = [
  {
    memberId: "m1",
    monthlyBudget: 90000,
    byCategory: {
      Peluquería: 18000,
      Gimnasio: 15000,
      Ropa: 25000,
      Salidas: 18000,
      Cafetería: 8000,
      Hobbies: 6000,
    },
  },
  {
    memberId: "m2",
    monthlyBudget: 75000,
    byCategory: {
      Gimnasio: 18000,
      Deportes: 20000,
      Ropa: 12000,
      Salidas: 12000,
      Cafetería: 7000,
      "Apps personales": 6000,
    },
  },
  {
    memberId: "m3",
    monthlyBudget: 25000,
    byCategory: {
      Salidas: 8000,
      Cursos: 12000,
      Hobbies: 5000,
    },
  },
];

export const householdFinancialProfile: FinancialProfile = "equilibrado";

export function getMemberName(id?: string): string {
  if (!id) return "Hogar";
  return members.find((m) => m.id === id)?.name ?? "Hogar";
}
