"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTransactions } from "@/lib/store/app-store";
import { CURRENT_MEMBER_ID } from "@/lib/store/current-user";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#0d9488", "#22c55e", "#a855f7", "#0ea5e9", "#f59e0b", "#ef4444", "#84cc16", "#06b6d4"];

export function MyCategoriesDistribution() {
  const transactions = useTransactions();
  const mine = transactions.filter(
    (t) => t.scope === "personal" && t.memberId === CURRENT_MEMBER_ID && t.type === "gasto",
  );
  const total = mine.reduce((acc, t) => acc + t.amount, 0);

  const map = new Map<string, number>();
  for (const t of mine) {
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  }
  const entries = Array.from(map.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Distribución por categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cargá tu primer gasto para empezar a ver tu distribución.
          </p>
        </CardContent>
      </Card>
    );
  }

  const top = entries[0];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Distribución por categoría</CardTitle>
        <p className="text-xs text-muted-foreground">
          {top.category} es tu categoría más alta — {formatCurrency(top.amount)} ({Math.round((top.amount / total) * 100)}%).
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {entries.map((e, idx) => {
          const pct = Math.round((e.amount / total) * 100);
          return (
            <div key={e.category}>
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="font-medium">{e.category}</span>
                </div>
                <span className="text-muted-foreground tabular-nums">
                  {formatCurrency(e.amount)} · {pct}%
                </span>
              </div>
              <Progress value={pct} indicatorClassName="bg-primary" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
