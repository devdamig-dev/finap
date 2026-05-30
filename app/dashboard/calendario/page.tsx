"use client";

import { Plus } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { CalendarAgenda } from "@/components/calendar/calendar-agenda";
import { Card, CardContent } from "@/components/ui/card";
import { useActions } from "@/components/forms/action-context";
import { useBills } from "@/lib/store/app-store";
import { daysUntil, formatCurrency } from "@/lib/utils";

export default function CalendarioPage() {
  const bills = useBills();
  const { open } = useActions();
  const proximos = bills.filter((b) => b.status !== "pagado" && daysUntil(b.dueDate) >= 0).length;
  const vencidos = bills.filter((b) => b.status === "vencido").length;
  const totalProximos = bills
    .filter((b) => b.status !== "pagado" && daysUntil(b.dueDate) >= 0 && daysUntil(b.dueDate) <= 7)
    .reduce((acc, b) => acc + b.amount, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Calendario"
        description="Todo lo que pasa esta semana en tu hogar, agrupado por día."
        action={
          <Button size="sm" className="hidden sm:flex" onClick={() => open("bill")}>
            <Plus className="h-4 w-4" /> Agregar vencimiento
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Próximos</p>
            <p className="text-xl font-semibold mt-1">{proximos}</p>
            <p className="text-xs text-muted-foreground mt-1">vencimientos pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Esta semana</p>
            <p className="text-xl font-semibold mt-1 tabular-nums">{formatCurrency(totalProximos)}</p>
            <p className="text-xs text-muted-foreground mt-1">a pagar en 7 días</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Atención</p>
            <p className="text-xl font-semibold mt-1 text-[hsl(var(--danger))]">{vencidos}</p>
            <p className="text-xs text-muted-foreground mt-1">vencidos sin pagar</p>
          </CardContent>
        </Card>
      </div>

      <CalendarAgenda />
    </div>
  );
}
