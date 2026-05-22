import type { SavingPocket } from "@/lib/types";

/**
 * "Bolsillos" donde se reparte el ahorro del hogar.
 * Algunos están atados a un objetivo (`goalId`) y otros son libres.
 *
 * El monto NO necesariamente coincide con el saldo de la cuenta: representa
 * cuánto del ahorro total está mentalmente destinado a esa caja.
 */
export const savingPockets: SavingPocket[] = [
  {
    id: "sp1",
    name: "Fondo de emergencia",
    amount: 1450000,
    goalId: "g1",
    accountId: "a3", // cuenta remunerada
    emoji: "🛟",
  },
  {
    id: "sp2",
    name: "Vacaciones Bariloche",
    amount: 420000,
    goalId: "g2",
    accountId: "a4", // mercado pago
    emoji: "🏔️",
  },
  {
    id: "sp3",
    name: "Arreglos del hogar",
    amount: 320000,
    goalId: "g3",
    accountId: "a6", // FCI
    emoji: "🛠️",
  },
  {
    id: "sp4",
    name: "Cambio de heladera",
    amount: 95000,
    goalId: "g4",
    accountId: "a7", // plazo fijo
    emoji: "🧊",
  },
  {
    id: "sp5",
    name: "Reserva libre",
    amount: 240000,
    accountId: "a5", // dólares
    emoji: "💵",
  },
];

/** Promedio de los últimos meses, mock. */
export const averageMonthlyExpense = 1320000;

/** Aporte de ahorro estimado del mes en curso (mock) */
export const monthlySavingContribution = 360000;

/** Aporte ideal según perfil conservador (mock) */
export const recommendedMonthlySaving = 280000;

export function getSavingsTotal(): number {
  return savingPockets.reduce((acc, p) => acc + p.amount, 0);
}

/**
 * Cobertura del fondo de emergencia expresada en meses de gasto promedio.
 * Una meta saludable inicial suele ser 3 meses.
 */
export function getEmergencyFundCoverageMonths(): number {
  const emergency = savingPockets.find((p) => p.id === "sp1");
  if (!emergency) return 0;
  return Number((emergency.amount / averageMonthlyExpense).toFixed(1));
}

/** Dinero ahorrado que aún no fue asignado a ningún objetivo. */
export function getUnallocatedSavings(): number {
  return savingPockets
    .filter((p) => !p.goalId)
    .reduce((acc, p) => acc + p.amount, 0);
}
