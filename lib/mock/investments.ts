import type { Investment } from "@/lib/types";

/**
 * Inversiones simuladas del hogar.
 * Esto NO es asesoramiento financiero ni promete rentabilidad: son
 * datos mockeados para que el usuario pueda visualizar y organizar.
 */
export const investments: Investment[] = [
  {
    id: "i1",
    name: "FCI conservador en pesos",
    type: "fci",
    principal: 300000,
    currentValue: 320000,
    startedAt: "2025-11-10",
    notes: "Liquidez t+1, perfil conservador.",
  },
  {
    id: "i2",
    name: "Plazo fijo Galicia 30 días",
    type: "plazo-fijo",
    principal: 240000,
    currentValue: 250000,
    startedAt: "2026-04-21",
    maturesAt: "2026-05-21",
    memberId: "m1",
  },
  {
    id: "i3",
    name: "Dólares en mano",
    type: "dolar",
    principal: 440000,
    currentValue: 460000,
    startedAt: "2025-09-01",
    notes: "Reserva de valor del hogar.",
  },
  {
    id: "i4",
    name: "USDC en exchange",
    type: "cripto",
    principal: 90000,
    currentValue: 87000,
    startedAt: "2026-02-12",
    memberId: "m2",
    notes: "Posición chica, sólo a modo de prueba.",
  },
];

export function getInvestmentsValue(): number {
  return investments.reduce((acc, i) => acc + i.currentValue, 0);
}
