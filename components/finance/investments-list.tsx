import { ArrowDownRight, ArrowUpRight, LineChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMemberName } from "@/lib/mock/members";
import { investments } from "@/lib/mock/investments";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { InvestmentType } from "@/lib/types";

const TYPE_LABEL: Record<InvestmentType, string> = {
  fci: "FCI",
  "plazo-fijo": "Plazo fijo",
  dolar: "Dólares",
  acciones: "Acciones",
  bonos: "Bonos",
  cripto: "Cripto",
  otro: "Otro",
};

export function InvestmentsList() {
  const total = investments.reduce((acc, i) => acc + i.currentValue, 0);
  const totalPrincipal = investments.reduce((acc, i) => acc + i.principal, 0);
  const variation = total - totalPrincipal;
  const variationPct = totalPrincipal > 0 ? (variation / totalPrincipal) * 100 : 0;
  const positive = variation >= 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-4 w-4 text-primary" /> Inversiones
        </CardTitle>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-2xl font-semibold tabular-nums">{formatCurrency(total)}</p>
          <span
            className={cn(
              "text-xs font-medium inline-flex items-center gap-0.5",
              positive ? "text-[hsl(var(--success))]" : "text-[hsl(var(--danger))]",
            )}
          >
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {positive ? "+" : ""}
            {formatCurrency(variation)} ({variationPct.toFixed(1)}%)
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Esto no es asesoramiento financiero. Sólo es una guía de organización.
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {investments.map((inv) => {
          const v = inv.currentValue - inv.principal;
          const pct = inv.principal > 0 ? (v / inv.principal) * 100 : 0;
          const up = v >= 0;
          return (
            <div key={inv.id} className="flex items-center gap-3 rounded-xl border p-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <LineChart className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium truncate">{inv.name}</p>
                  <Badge variant="outline" className="text-[10px]">{TYPE_LABEL[inv.type]}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {getMemberName(inv.memberId)}
                  {inv.maturesAt && ` · Vence ${formatDate(inv.maturesAt)}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums">{formatCurrency(inv.currentValue)}</p>
                <p
                  className={cn(
                    "text-[10px] tabular-nums",
                    up ? "text-[hsl(var(--success))]" : "text-[hsl(var(--danger))]",
                  )}
                >
                  {up ? "+" : ""}
                  {pct.toFixed(1)}%
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
