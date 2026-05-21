import { CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

const cards = [
  { id: "c1", brand: "Visa Galicia", holder: "Camila", limit: 800000, used: 412000, dueDay: 14 },
  { id: "c2", brand: "Mastercard Santander", holder: "Martín", limit: 600000, used: 142000, dueDay: 19 },
  { id: "c3", brand: "Naranja X", holder: "Camila", limit: 350000, used: 95000, dueDay: 22 },
];

export function CardsDebts() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Tarjetas y deudas</CardTitle>
        <p className="text-xs text-muted-foreground">Consumos del mes y límites disponibles</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {cards.map((c) => {
          const pct = Math.round((c.used / c.limit) * 100);
          return (
            <div key={c.id} className="rounded-xl border p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.brand}</p>
                    <p className="text-xs text-muted-foreground">{c.holder} · cierra día {c.dueDay}</p>
                  </div>
                </div>
                <Badge variant={pct > 70 ? "warning" : "info"} className="text-[10px]">
                  {pct}% usado
                </Badge>
              </div>
              <div className="mt-3">
                <Progress
                  value={pct}
                  indicatorClassName={pct > 80 ? "bg-[hsl(var(--danger))]" : pct > 60 ? "bg-[hsl(var(--warning))]" : "bg-primary"}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1.5 tabular-nums">
                  <span>{formatCurrency(c.used)}</span>
                  <span>Límite {formatCurrency(c.limit)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
