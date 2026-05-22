import { PiggyBank, ShieldCheck, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { householdTransactions } from "@/lib/mock/transactions";
import { getMonthlySummary } from "@/lib/ai/recommendations";
import {
  averageMonthlyExpense,
  getEmergencyFundCoverageMonths,
  monthlySavingContribution,
  savingPockets,
} from "@/lib/mock/savings";
import { cn, formatCurrency } from "@/lib/utils";

const EMERGENCY_TARGET_MONTHS = 3;

export function SavingsOverview() {
  const { totalIncome, savingRate } = getMonthlySummary(householdTransactions);
  const ratePct = Math.round(savingRate * 100);
  const months = getEmergencyFundCoverageMonths();
  const coveragePct = Math.min(100, Math.round((months / EMERGENCY_TARGET_MONTHS) * 100));
  const targetAmount = averageMonthlyExpense * EMERGENCY_TARGET_MONTHS;
  const currentEmergency = savingPockets.find((p) => p.id === "sp1")?.amount ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <SavingMetric
        icon={PiggyBank}
        label="Ahorro del mes"
        value={formatCurrency(monthlySavingContribution)}
        hint={`Sobre ${formatCurrency(totalIncome)} de ingresos`}
        tone="primary"
      />
      <SavingMetric
        icon={TrendingUp}
        label="Tasa de ahorro"
        value={`${ratePct}%`}
        hint={
          ratePct >= 20
            ? "Buen ritmo. Una parte podría ir a objetivos."
            : ratePct >= 10
            ? "Estás en el rango sano. Sumar un poco más libera margen."
            : "Apuntar al 10–20% suele ser una buena referencia."
        }
        tone={ratePct >= 20 ? "success" : ratePct >= 10 ? "info" : "warning"}
      />

      <Card className="md:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Fondo de emergencia
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Cubre aproximadamente {months} {months === 1 ? "mes" : "meses"} de gastos del hogar.
            Una meta inicial sana es llegar a {EMERGENCY_TARGET_MONTHS} meses.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-semibold tabular-nums">
                {formatCurrency(currentEmergency)}
              </p>
              <p className="text-xs text-muted-foreground">
                Meta sugerida: {formatCurrency(targetAmount)}
              </p>
            </div>
            <Badge
              variant={coveragePct >= 100 ? "success" : coveragePct >= 50 ? "info" : "warning"}
              className="text-[10px]"
            >
              {coveragePct}% de la meta
            </Badge>
          </div>
          <Progress
            value={coveragePct}
            indicatorClassName={cn(
              coveragePct >= 100
                ? "bg-[hsl(var(--success))]"
                : coveragePct >= 50
                ? "bg-primary"
                : "bg-[hsl(var(--warning))]",
            )}
          />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Esto no es asesoramiento financiero. Usalo como una guía para organizar
            tus decisiones del hogar.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function SavingMetric({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
  tone: "primary" | "success" | "info" | "warning";
}) {
  const toneMap = {
    primary: { bg: "bg-primary/10", fg: "text-primary" },
    success: { bg: "bg-success-soft", fg: "text-[hsl(var(--success))]" },
    info: { bg: "bg-accent", fg: "text-accent-foreground" },
    warning: { bg: "bg-warning-soft", fg: "text-[hsl(var(--warning-foreground))]" },
  }[tone];

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center", toneMap.bg)}>
            <Icon className={cn("h-4 w-4", toneMap.fg)} />
          </div>
        </div>
        <p className="text-lg lg:text-xl font-semibold mt-2 tabular-nums">{value}</p>
        {hint && <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{hint}</p>}
      </CardContent>
    </Card>
  );
}
