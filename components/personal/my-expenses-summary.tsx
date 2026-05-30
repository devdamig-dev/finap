"use client";

import { TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTransactions } from "@/lib/store/app-store";
import { CURRENT_MEMBER_ID } from "@/lib/store/current-user";
import { personalBudgets, members } from "@/lib/mock/members";
import { cn, formatCurrency } from "@/lib/utils";

export function MyExpensesSummary() {
  const transactions = useTransactions();
  const mine = transactions.filter(
    (t) => t.scope === "personal" && t.memberId === CURRENT_MEMBER_ID && t.type === "gasto",
  );
  const spent = mine.reduce((acc, t) => acc + t.amount, 0);
  const budget =
    personalBudgets.find((p) => p.memberId === CURRENT_MEMBER_ID)?.monthlyBudget ??
    members.find((m) => m.id === CURRENT_MEMBER_ID)?.personalBudget ??
    0;
  const available = Math.max(0, budget - spent);
  const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  const over = pct > 100;

  const items = [
    {
      label: "Tu presupuesto personal",
      value: formatCurrency(budget),
      icon: Wallet,
      tone: "bg-primary/10 text-primary",
    },
    {
      label: "Gastos del mes",
      value: formatCurrency(spent),
      icon: TrendingUp,
      tone: over ? "bg-danger-soft text-[hsl(var(--danger))]" : "bg-warning-soft text-[hsl(var(--warning-foreground))]",
    },
    {
      label: "Disponible",
      value: formatCurrency(available),
      icon: Wallet,
      tone: "bg-success-soft text-[hsl(var(--success))]",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <Card key={it.label} className="border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground font-medium">{it.label}</p>
                  <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center", it.tone)}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-lg lg:text-xl font-semibold mt-2 tabular-nums">{it.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Usado del presupuesto</span>
            <span className="font-medium tabular-nums">{pct}%</span>
          </div>
          <Progress
            value={Math.min(100, pct)}
            indicatorClassName={cn(
              over
                ? "bg-[hsl(var(--danger))]"
                : pct > 80
                ? "bg-[hsl(var(--warning))]"
                : "bg-primary",
            )}
          />
          {over && (
            <p className="text-xs text-[hsl(var(--danger))]">
              Superaste tu presupuesto personal en {formatCurrency(spent - budget)}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
