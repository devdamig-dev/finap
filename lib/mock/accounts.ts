import type { Account } from "@/lib/types";

/**
 * Cuentas y "bolsillos" donde el hogar guarda su plata.
 * Algunas son cuentas operativas, otras se consideran ahorro (`isSaving`).
 *
 * Los montos están expresados en ARS para facilitar la lectura (mock).
 * Cuando llegue Supabase, cada cuenta tendrá su `currency` real y se
 * convertirá a moneda del hogar en la capa de presentación.
 */
export const accounts: Account[] = [
  {
    id: "a1",
    name: "Efectivo",
    kind: "efectivo",
    balance: 85000,
    currency: "ARS",
    color: "#94a3b8",
  },
  {
    id: "a2",
    name: "Caja de ahorro Galicia",
    kind: "caja-ahorro",
    balance: 420000,
    currency: "ARS",
    memberId: "m1",
    color: "#0ea5e9",
  },
  {
    id: "a3",
    name: "Cuenta remunerada Santander",
    kind: "cuenta-remunerada",
    balance: 540000,
    currency: "ARS",
    memberId: "m2",
    isSaving: true,
    color: "#2563eb",
    notes: "Genera rendimiento diario",
  },
  {
    id: "a4",
    name: "Mercado Pago",
    kind: "billetera",
    balance: 178000,
    currency: "ARS",
    isSaving: true,
    color: "#14b8a6",
  },
  {
    id: "a5",
    name: "Dólares (caja fuerte)",
    kind: "dolares",
    balance: 460000, // mock equivalente en ARS
    currency: "USD",
    isSaving: true,
    color: "#16a34a",
    notes: "Aprox. USD 460 (mock al tipo de cambio del hogar)",
  },
  {
    id: "a6",
    name: "FCI conservador",
    kind: "fci",
    balance: 320000,
    currency: "ARS",
    isSaving: true,
    color: "#7c3aed",
    notes: "Pesos, rescate t+1",
  },
  {
    id: "a7",
    name: "Plazo fijo 30 días",
    kind: "plazo-fijo",
    balance: 250000,
    currency: "ARS",
    isSaving: true,
    color: "#a855f7",
    notes: "Vence en 12 días",
  },
  {
    id: "a8",
    name: "Cripto (USDC)",
    kind: "cripto",
    balance: 87000, // mock en ARS
    currency: "ARS",
    isSaving: true,
    color: "#f59e0b",
    notes: "Sólo como ejemplo, no es asesoramiento",
  },
];

/** Suma de las cuentas marcadas como ahorro */
export function getTotalSaving(): number {
  return accounts.filter((a) => a.isSaving).reduce((acc, a) => acc + a.balance, 0);
}

/** Suma total de activos (todo lo que el hogar tiene guardado) */
export function getTotalAssets(): number {
  return accounts.reduce((acc, a) => acc + a.balance, 0);
}
