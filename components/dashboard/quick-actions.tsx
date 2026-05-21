"use client";

import { Calendar, ListChecks, Receipt, ShoppingCart, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const actions = [
  { label: "Cargar gasto", icon: TrendingDown, color: "text-[hsl(var(--danger))]", bg: "bg-danger-soft" },
  { label: "Cargar ingreso", icon: TrendingUp, color: "text-[hsl(var(--success))]", bg: "bg-success-soft" },
  { label: "Crear tarea", icon: ListChecks, color: "text-primary", bg: "bg-accent" },
  { label: "Agregar vencimiento", icon: Calendar, color: "text-[hsl(var(--warning-foreground))]", bg: "bg-warning-soft" },
  { label: "Nueva compra", icon: ShoppingCart, color: "text-primary", bg: "bg-accent" },
  { label: "Sumar factura", icon: Receipt, color: "text-foreground", bg: "bg-muted" },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Accesos rápidos</CardTitle>
        <p className="text-xs text-muted-foreground">Cargá en segundos lo que pase en casa</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.label}
                type="button"
                onClick={() =>
                  window.alert(`Próximamente: ${a.label.toLowerCase()} en un solo paso.`)
                }
                className="flex flex-col items-center gap-2 rounded-xl border bg-card p-3 text-center transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <span className={cn("h-9 w-9 rounded-lg flex items-center justify-center", a.bg)}>
                  <Icon className={cn("h-4 w-4", a.color)} />
                </span>
                <span className="text-[11px] leading-tight font-medium">{a.label}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
