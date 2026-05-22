"use client";

import { Activity, CheckCircle2, TriangleAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getHouseholdHealth, getMonthlySummary } from "@/lib/ai/recommendations";
import { useTransactions } from "@/lib/store/app-store";
import { cn, formatCurrency } from "@/lib/utils";

export function FinancialHealthCard() {
  const all = useTransactions();
  const transactions = all.filter((t) => t.scope !== "personal");
  const health = getHouseholdHealth(transactions);
  const { totalIncome, totalExpense } = getMonthlySummary(transactions);
  const used = totalIncome > 0 ? Math.min(100, Math.round((totalExpense / totalIncome) * 100)) : 0;

  const palette = {
    estable: {
      icon: CheckCircle2,
      color: "text-[hsl(var(--success))]",
      bg: "bg-success-soft",
      ring: "ring-success/30",
      indicator: "bg-[hsl(var(--success))]",
    },
    ajustado: {
      icon: Activity,
      color: "text-[hsl(var(--warning-foreground))]",
      bg: "bg-warning-soft",
      ring: "ring-warning/30",
      indicator: "bg-[hsl(var(--warning))]",
    },
    alerta: {
      icon: TriangleAlert,
      color: "text-[hsl(var(--danger))]",
      bg: "bg-danger-soft",
      ring: "ring-danger/30",
      indicator: "bg-[hsl(var(--danger))]",
    },
  }[health.status];

  const Icon = palette.icon;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", palette.bg)}>
            <Icon className={cn("h-6 w-6", palette.color)} />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
              Estado del hogar
            </p>
            <h3 className="text-lg font-semibold mt-0.5">{health.label}</h3>
            <p className="text-sm text-muted-foreground mt-1">{health.description}</p>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Usado del mes</span>
            <span className="font-medium text-foreground">
              {formatCurrency(totalExpense)} / {formatCurrency(totalIncome)}
            </span>
          </div>
          <Progress value={used} indicatorClassName={palette.indicator} />
        </div>
      </CardContent>
    </Card>
  );
}
