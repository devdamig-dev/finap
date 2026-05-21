import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { goals } from "@/lib/mock/goals";
import { formatCurrency, percentage } from "@/lib/utils";

export function GoalsOverview({ limit = 3 }: { limit?: number }) {
  const list = goals.slice(0, limit);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle>Objetivos activos</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tu progreso de ahorro familiar
          </p>
        </div>
        <Link
          href="/dashboard/finanzas"
          className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline"
        >
          Ver todos <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {list.map((goal) => {
          const pct = percentage(goal.saved, goal.target);
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base">{goal.emoji}</span>
                  <p className="text-sm font-medium truncate">{goal.title}</p>
                </div>
                {goal.status === "atrasado" ? (
                  <Badge variant="warning" className="text-[10px]">Atrasado</Badge>
                ) : (
                  <Badge variant="success" className="text-[10px]">Al día</Badge>
                )}
              </div>
              <Progress
                value={pct}
                indicatorClassName={goal.status === "atrasado" ? "bg-[hsl(var(--warning))]" : "bg-primary"}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="tabular-nums">
                  {formatCurrency(goal.saved)} / {formatCurrency(goal.target)}
                </span>
                <span>{pct}%</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
