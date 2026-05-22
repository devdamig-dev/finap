"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { usePrivacy, useTransactions } from "@/lib/store/app-store";
import { members, personalBudgets } from "@/lib/mock/members";
import { getMonthlySummary } from "@/lib/ai/recommendations";
import { cn, formatCurrency, percentage } from "@/lib/utils";

export function PersonalAggregatedCard({ compact = false }: { compact?: boolean }) {
  const transactions = useTransactions();
  const privacy = usePrivacy();

  const personalSpent = transactions
    .filter((t) => t.scope === "personal" && t.type === "gasto")
    .reduce((acc, t) => acc + t.amount, 0);

  const household = transactions.filter((t) => t.scope !== "personal");
  const summary = getMonthlySummary(household);

  const shareOfIncome = summary.totalIncome > 0 ? percentage(personalSpent, summary.totalIncome) : 0;

  const byMember = members.map((m) => {
    const spent = transactions
      .filter((t) => t.scope === "personal" && t.memberId === m.id && t.type === "gasto")
      .reduce((acc, t) => acc + t.amount, 0);
    const budget =
      personalBudgets.find((p) => p.memberId === m.id)?.monthlyBudget ?? m.personalBudget ?? 0;
    return { member: m, spent, budget, over: budget > 0 && spent > budget };
  });

  const totalBudget = byMember.reduce((acc, x) => acc + x.budget, 0);
  const totalOver = byMember.some((x) => x.over);

  const status = totalOver
    ? { tone: "warning" as const, label: "Algún integrante excedió su presupuesto" }
    : { tone: "success" as const, label: "Todos dentro de presupuesto" };

  // Reglas de privacidad
  const showByMember = privacy.shareAggregates;
  const showDetailLink = privacy.personalDetailsVisible;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Gastos personales del hogar
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Total del mes: <span className="font-medium text-foreground">{formatCurrency(personalSpent)}</span>
              {summary.totalIncome > 0 && (
                <span className="text-muted-foreground"> · {shareOfIncome}% de los ingresos</span>
              )}
            </p>
          </div>
          <Badge variant={status.tone === "warning" ? "warning" : "success"} className="text-[10px]">
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {!compact && totalBudget > 0 && (
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Presupuesto personal agregado</span>
              <span className="font-medium tabular-nums">
                {formatCurrency(personalSpent)} / {formatCurrency(totalBudget)}
              </span>
            </div>
            <Progress
              value={Math.min(100, Math.round((personalSpent / totalBudget) * 100))}
              indicatorClassName={cn(
                personalSpent > totalBudget
                  ? "bg-[hsl(var(--danger))]"
                  : personalSpent > totalBudget * 0.8
                  ? "bg-[hsl(var(--warning))]"
                  : "bg-primary",
              )}
            />
          </div>
        )}

        {showByMember ? (
          <div className="space-y-2">
            {byMember.map(({ member, spent, budget, over }) => {
              const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0"
                      style={{ backgroundColor: member.avatarColor }}
                    >
                      {member.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{member.name}</p>
                      <p className="text-[11px] text-muted-foreground tabular-nums">
                        {formatCurrency(spent)}
                        {budget > 0 && <> / {formatCurrency(budget)} · {pct}%</>}
                      </p>
                    </div>
                  </div>
                  {over && <Badge variant="warning" className="text-[10px]">Excedido</Badge>}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border p-3 flex items-start gap-3 bg-muted/30">
            <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              Privacidad activa: no estamos compartiendo el detalle por integrante con el resto
              del hogar. Cada uno ve su propio detalle en <strong>Mis gastos</strong>.
            </p>
          </div>
        )}

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {showDetailLink
            ? "Mostramos sólo agregados — el detalle vive en cada Mis gastos."
            : "Mostramos totales agregados para cuidar la privacidad de cada integrante."}
        </p>

        <Button asChild variant="soft" size="sm" className="w-full">
          <Link href="/dashboard/mis-gastos">
            Ver mis gastos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
