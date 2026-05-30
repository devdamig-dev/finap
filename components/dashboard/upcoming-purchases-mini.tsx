"use client";

import { ArrowRight, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActions } from "@/components/forms/action-context";
import { usePurchases } from "@/lib/store/app-store";
import { daysUntil, formatCurrency, formatDate } from "@/lib/utils";

export function UpcomingPurchasesMini({ limit = 4 }: { limit?: number }) {
  const purchases = usePurchases();
  const { open } = useActions();

  const previstas = purchases
    .filter((p) => p.status === "prevista")
    .sort((a, b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime());

  const totalEstimado = previstas.reduce((acc, p) => acc + p.estimatedAmount, 0);
  const list = previstas.slice(0, limit);

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0 pb-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-primary" /> Próximas compras
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            {previstas.length} previstas · estimado {formatCurrency(totalEstimado)}
          </p>
        </div>
        <Link
          href="/dashboard/hogar"
          className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline"
        >
          Ver todas <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {list.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No hay compras previstas. Registrá una para empezar.
          </p>
        )}
        {list.map((p) => {
          const days = daysUntil(p.plannedDate);
          const today = days === 0;
          const overdue = days < 0;
          return (
            <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border p-3">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{p.title}</p>
                <p className="text-xs text-muted-foreground">
                  {p.category} ·{" "}
                  {overdue
                    ? `Atrasada ${Math.abs(days)}d`
                    : today
                    ? "Hoy"
                    : `${formatDate(p.plannedDate)}`}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold tabular-nums">
                  {formatCurrency(p.estimatedAmount)}
                </p>
                {overdue && <Badge variant="warning" className="text-[10px] mt-0.5">Atrasada</Badge>}
              </div>
            </div>
          );
        })}
        <Button
          size="sm"
          variant="soft"
          className="w-full mt-1"
          onClick={() => open("shopping")}
        >
          <Plus className="h-3.5 w-3.5" /> Registrar compra
        </Button>
      </CardContent>
    </Card>
  );
}
