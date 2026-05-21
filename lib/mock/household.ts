import type { Household, HouseholdMember } from "@/lib/types";

export const members: HouseholdMember[] = [
  { id: "m1", name: "Camila", role: "Administrador", avatarColor: "#0d9488", initials: "CM" },
  { id: "m2", name: "Martín", role: "Miembro", avatarColor: "#0f766e", initials: "MR" },
  { id: "m3", name: "Lucía", role: "Miembro", avatarColor: "#65a30d", initials: "LU" },
];

export const household: Household = {
  id: "h1",
  name: "Casa Rivero",
  currency: "ARS",
  members,
  monthlyIncomeTarget: 1850000,
};
