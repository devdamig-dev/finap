import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bills } from "@/lib/mock/bills";
import { cn, daysUntil, formatCurrency, formatDate } from "@/lib/utils";

export function UpcomingBillsList({ limit = 4 }: { limit?: number }) {
  const list = [...bills]
    .filter((b) => b.status !== "pagado")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, limit);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle>Próximos vencimientos</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">{list.length} pagos por resolver</p>
        </div>
        <Link
          href="/dashboard/calendario"
          className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline"
        >
          Ver todo <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {list.map((bill) => {
          const days = daysUntil(bill.dueDate);
          const overdue = days < 0;
          const today = days === 0;
          return (
            <div
              key={bill.id}
              className="flex items-center justify-between rounded-xl border bg-card/60 p-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                    overdue ? "bg-danger-soft text-[hsl(var(--danger))]" : "bg-accent text-primary",
                  )}
                >
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{bill.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {overdue
                      ? `Vencido hace ${Math.abs(days)}d`
                      : today
                      ? "Vence hoy"
                      : `${formatDate(bill.dueDate)} · en ${days}d`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums">{formatCurrency(bill.amount)}</p>
                <Badge
                  variant={overdue ? "danger" : today ? "warning" : "info"}
                  className="mt-1 text-[10px]"
                >
                  {overdue ? "Vencido" : today ? "Hoy" : "Próximo"}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
