"use client";

import { PiggyBank, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  averageMonthlyExpense,
  getEmergencyFundCoverageMonths,
  monthlySavingContribution,
  savingPockets,
} from "@/lib/mock/savings";
import { getMonthlySummary } from "@/lib/ai/recommendations";
import { useTransactions } from "@/lib/store/app-store";
import { cn, formatCurrency } from "@/lib/utils";

const EMERGENCY_TARGET_MONTHS = 3;

export function SavingsMini() {
  const all = useTransactions();
  const household = all.filter((t) => t.scope !== "personal");
  const { savingRate } = getMonthlySummary(household);
  const ratePct = Math.round(savingRate * 100);
  const months = getEmergencyFundCoverageMonths();
  const coveragePct = Math.min(100, Math.round((months / EMERGENCY_TARGET_MONTHS) * 100));
  const emergency = savingPockets.find((p) => p.id === "sp1")?.amount ?? 0;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <PiggyBank className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
              Ahorro del mes
            </p>
            <p className="text-2xl font-semibold mt-0.5 tabular-nums">
              {formatCurrency(monthlySavingContribution)}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {ratePct}% de tasa de ahorro este mes
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-muted/40 p-3">
          <div className="flex items-center gap-2 text-xs font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Fondo de emergencia
            <span className="ml-auto text-muted-foreground tabular-nums">
              {formatCurrency(emergency)} / {formatCurrency(averageMonthlyExpense * EMERGENCY_TARGET_MONTHS)}
            </span>
          </div>
          <Progress
            value={coveragePct}
            className="mt-2"
            indicatorClassName={cn(
              coveragePct >= 100
                ? "bg-[hsl(var(--success))]"
                : coveragePct >= 50
                ? "bg-primary"
                : "bg-[hsl(var(--warning))]",
            )}
          />
          <p className="text-[10px] text-muted-foreground mt-1.5">
            Cubre {months} {months === 1 ? "mes" : "meses"} de gastos. Meta inicial: {EMERGENCY_TARGET_MONTHS} meses.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
