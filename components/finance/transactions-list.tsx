import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Transaction } from "@/lib/types";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

interface Props {
  title?: string;
  description?: string;
  transactions: Transaction[];
  limit?: number;
}

export function TransactionsList({ title = "Movimientos", description, transactions, limit }: Props) {
  const list = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="space-y-1">
        {list.length === 0 && (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Sin movimientos para mostrar.
          </p>
        )}
        {list.map((t) => {
          const income = t.type === "ingreso";
          return (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/50 transition-colors"
            >
              <div
                className={cn(
                  "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                  income ? "bg-success-soft text-[hsl(var(--success))]" : "bg-danger-soft text-[hsl(var(--danger))]",
                )}
              >
                {income ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{t.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="truncate">{t.category}</span>
                  {t.kind && (
                    <Badge variant="outline" className="text-[10px] capitalize">{t.kind}</Badge>
                  )}
                  {t.recurring && (
                    <Badge variant="info" className="text-[10px]">Recurrente</Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    income ? "text-[hsl(var(--success))]" : "text-foreground",
                  )}
                >
                  {income ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </p>
                <p className="text-[10px] text-muted-foreground">{formatDate(t.date)}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
