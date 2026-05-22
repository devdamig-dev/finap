import { ArrowUpRight, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { accounts } from "@/lib/mock/accounts";
import { cn, formatCurrency } from "@/lib/utils";

const debts = [
  { id: "d1", name: "Visa Galicia", amount: 412000 },
  { id: "d2", name: "Mastercard Santander", amount: 142000 },
  { id: "d3", name: "Naranja X", amount: 95000 },
];

// Variación mensual simulada
const lastMonthNetWorth = 1612000;

export function NetWorthCard({ compact = false }: { compact?: boolean }) {
  const assets = accounts.reduce((acc, a) => acc + a.balance, 0);
  const liabilities = debts.reduce((acc, d) => acc + d.amount, 0);
  const netWorth = assets - liabilities;
  const variation = netWorth - lastMonthNetWorth;
  const variationPct = lastMonthNetWorth > 0 ? (variation / lastMonthNetWorth) * 100 : 0;
  const positive = variation >= 0;

  if (compact) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium">Patrimonio estimado</p>
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Scale className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-lg lg:text-xl font-semibold mt-2 tabular-nums">{formatCurrency(netWorth)}</p>
          <p
            className={cn(
              "text-[11px] mt-1 inline-flex items-center gap-1",
              positive ? "text-[hsl(var(--success))]" : "text-[hsl(var(--danger))]",
            )}
          >
            <ArrowUpRight className={cn("h-3 w-3", !positive && "rotate-90")} />
            {positive ? "+" : ""}
            {formatCurrency(variation)} vs mes pasado
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" /> Patrimonio estimado
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Suma de cuentas e inversiones menos deudas de tarjetas.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-3xl font-semibold tabular-nums">{formatCurrency(netWorth)}</p>
          <p
            className={cn(
              "text-xs mt-1 inline-flex items-center gap-1",
              positive ? "text-[hsl(var(--success))]" : "text-[hsl(var(--danger))]",
            )}
          >
            <ArrowUpRight className={cn("h-3 w-3", !positive && "rotate-90")} />
            {positive ? "+" : ""}
            {formatCurrency(variation)} ({variationPct.toFixed(1)}%) vs mes pasado
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-success-soft p-3">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
              Activos
            </p>
            <p className="text-lg font-semibold tabular-nums mt-1 text-[hsl(var(--success))]">
              {formatCurrency(assets)}
            </p>
          </div>
          <div className="rounded-xl bg-danger-soft p-3">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
              Deudas
            </p>
            <p className="text-lg font-semibold tabular-nums mt-1 text-[hsl(var(--danger))]">
              {formatCurrency(liabilities)}
            </p>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Esto no es asesoramiento financiero. Sirve para tener una foto rápida del
          patrimonio del hogar y ver cómo evoluciona mes a mes.
        </p>
      </CardContent>
    </Card>
  );
}
