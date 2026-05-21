import type { HouseholdDocument } from "@/lib/types";

const today = new Date();
const inDays = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

export const documents: HouseholdDocument[] = [
  { id: "d1", title: "Póliza seguro auto", category: "Seguros", expiresAt: inDays(45), fileName: "poliza_la_caja.pdf", uploadedAt: inDays(-90) },
  { id: "d2", title: "Cédula verde Etios", category: "Vehículo", expiresAt: inDays(420), fileName: "cedula_etios.pdf", uploadedAt: inDays(-200) },
  { id: "d3", title: "Contrato de alquiler", category: "Servicios", expiresAt: inDays(180), fileName: "contrato_alquiler.pdf", uploadedAt: inDays(-365) },
  { id: "d4", title: "DNI Lucía", category: "Identidad", expiresAt: inDays(900), fileName: "dni_lucia.pdf", uploadedAt: inDays(-700) },
  { id: "d5", title: "Carnet OSDE familiar", category: "Salud", uploadedAt: inDays(-30), fileName: "carnet_osde.pdf" },
  { id: "d6", title: "ABL — comprobante", category: "Impuestos", expiresAt: inDays(20), fileName: "abl_2025.pdf", uploadedAt: inDays(-15) },
];
