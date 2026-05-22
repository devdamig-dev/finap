"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getExpenseByCategory, getMonthlySummary } from "@/lib/ai/recommendations";
import { useTransactions } from "@/lib/store/app-store";
import { formatCurrency } from "@/lib/utils";

const budgets: Record<string, number> = {
  Supermercado: 110000,
  Delivery: 30000,
  Transporte: 60000,
  Salud: 200000,
  Entretenimiento: 25000,
  Suscripciones: 18000,
  Hogar: 20000,
};

export function BudgetOverview() {
  const all = useTransactions();
  const transactions = all.filter((t) => t.scope !== "personal");
  const byCat = getExpenseByCategory(transactions);
  const { totalIncome, totalExpense } = getMonthlySummary(transactions);
  const monthBudget = Math.round(totalIncome * 0.85);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Presupuesto del mes</CardTitle>
        <p className="text-xs text-muted-foreground">
          Llevás gastado {formatCurrency(totalExpense)} de {formatCurrency(monthBudget)}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Total</span>
            <span className="font-medium">
              {Math.round((totalExpense / monthBudget) * 100)}%
            </span>
          </div>
          <Progress value={Math.min(100, (totalExpense / monthBudget) * 100)} />
        </div>
        <div className="space-y-3 pt-2">
          {Object.entries(budgets).map(([cat, budget]) => {
            const spent = byCat.find((c) => c.category === cat)?.amount ?? 0;
            const pct = Math.round((spent / budget) * 100);
            const exceeded = pct > 100;
            return (
              <div key={cat}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{cat}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {formatCurrency(spent)} / {formatCurrency(budget)}
                  </span>
                </div>
                <Progress
                  value={Math.min(100, pct)}
                  indicatorClassName={
                    exceeded
                      ? "bg-[hsl(var(--danger))]"
                      : pct > 80
                      ? "bg-[hsl(var(--warning))]"
                      : "bg-primary"
                  }
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
