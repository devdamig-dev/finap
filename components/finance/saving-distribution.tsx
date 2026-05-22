import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { goals } from "@/lib/mock/goals";
import { savingPockets } from "@/lib/mock/savings";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#0d9488", "#22c55e", "#a855f7", "#0ea5e9", "#f59e0b", "#ef4444"];

export function SavingDistribution() {
  const total = savingPockets.reduce((acc, p) => acc + p.amount, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Distribución del ahorro</CardTitle>
        <p className="text-xs text-muted-foreground">
          Cómo está repartido el total ahorrado ({formatCurrency(total)}).
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex h-3 w-full overflow-hidden rounded-full">
          {savingPockets.map((p, idx) => {
            const pct = total > 0 ? (p.amount / total) * 100 : 0;
            return (
              <div
                key={p.id}
                style={{ width: `${pct}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                title={`${p.name} — ${formatCurrency(p.amount)}`}
              />
            );
          })}
        </div>
        <ul className="mt-4 space-y-2">
          {savingPockets.map((p, idx) => {
            const goal = p.goalId ? goals.find((g) => g.id === p.goalId) : undefined;
            const pct = total > 0 ? Math.round((p.amount / total) * 100) : 0;
            return (
              <li key={p.id} className="flex items-center gap-3 text-sm">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="flex-1 truncate">
                  {p.emoji && <span className="mr-1">{p.emoji}</span>}
                  {p.name}
                  {goal && (
                    <span className="text-xs text-muted-foreground"> · objetivo</span>
                  )}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">{pct}%</span>
                <span className="text-sm font-medium tabular-nums w-24 text-right">
                  {formatCurrency(p.amount)}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
