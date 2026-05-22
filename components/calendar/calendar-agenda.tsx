"use client";

import { AlertCircle, Calendar, CheckCircle2, Clock, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBills, useTasks } from "@/lib/store/app-store";
import { maintenanceItems } from "@/lib/mock/maintenance";
import type { Bill, HouseholdTask } from "@/lib/types";
import { cn, daysUntil, formatCurrency, formatLongDate } from "@/lib/utils";

type AgendaItem = {
  id: string;
  date: string;
  type: "vencimiento" | "tarea" | "mantenimiento";
  title: string;
  subtitle?: string;
  amount?: number;
  status: "pagado" | "pendiente" | "vencido" | "proximo";
};

const statusMeta = {
  pagado: { label: "Pagado", variant: "success" as const, icon: CheckCircle2 },
  proximo: { label: "Próximo", variant: "info" as const, icon: Clock },
  pendiente: { label: "Pendiente", variant: "warning" as const, icon: Clock },
  vencido: { label: "Vencido", variant: "danger" as const, icon: AlertCircle },
};

function buildAgenda(bills: Bill[], tasks: HouseholdTask[]): AgendaItem[] {
  const items: AgendaItem[] = [];

  bills.forEach((b) => {
    items.push({
      id: `bill-${b.id}`,
      date: b.dueDate,
      type: "vencimiento",
      title: b.title,
      subtitle: b.responsible ? `Responsable: ${b.responsible}` : undefined,
      amount: b.amount,
      status: b.status,
    });
  });

  tasks
    .filter((t) => t.dueDate)
    .forEach((t) => {
      const overdue = t.status !== "completado" && t.dueDate && daysUntil(t.dueDate) < 0;
      items.push({
        id: `task-${t.id}`,
        date: t.dueDate!,
        type: "tarea",
        title: t.title,
        subtitle: `Responsable: ${t.responsible}`,
        status:
          t.status === "completado"
            ? "pagado"
            : overdue
            ? "vencido"
            : daysUntil(t.dueDate!) <= 3
            ? "proximo"
            : "pendiente",
      });
    });

  maintenanceItems.forEach((m) => {
    items.push({
      id: `mn-${m.id}`,
      date: m.nextDue,
      type: "mantenimiento",
      title: m.title,
      subtitle: m.asset,
      status:
        m.status === "atrasado" ? "vencido" : m.status === "proximo" ? "proximo" : "pendiente",
    });
  });

  return items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function groupByDate(items: AgendaItem[]) {
  const map = new Map<string, AgendaItem[]>();
  items.forEach((it) => {
    const day = new Date(it.date);
    day.setHours(0, 0, 0, 0);
    const key = day.toISOString();
    map.set(key, [...(map.get(key) ?? []), it]);
  });
  return Array.from(map.entries()).map(([date, items]) => ({ date, items }));
}

export function CalendarAgenda() {
  const bills = useBills();
  const tasks = useTasks();
  const agenda = groupByDate(buildAgenda(bills, tasks));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Agenda del hogar</CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          Vencimientos, tareas y mantenimientos por fecha
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {agenda.map(({ date, items }) => {
          const dDate = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const days = daysUntil(date);
          const label =
            days === 0
              ? "Hoy"
              : days === 1
              ? "Mañana"
              : days === -1
              ? "Ayer"
              : days < 0
              ? `Hace ${Math.abs(days)} días`
              : `En ${days} días`;

          return (
            <div key={date}>
              <div className="flex items-center gap-2 mb-2 sticky top-16 lg:top-0 bg-background/95 py-1 z-10">
                <p className="text-sm font-semibold capitalize">{formatLongDate(dDate)}</p>
                <span className="text-xs text-muted-foreground">· {label}</span>
              </div>
              <div className="space-y-2">
                {items.map((it) => {
                  const meta = statusMeta[it.status];
                  const Icon =
                    it.type === "vencimiento"
                      ? Calendar
                      : it.type === "mantenimiento"
                      ? Wrench
                      : Clock;
                  return (
                    <div key={it.id} className="flex items-center gap-3 rounded-xl border p-3">
                      <div
                        className={cn(
                          "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                          it.status === "vencido"
                            ? "bg-danger-soft text-[hsl(var(--danger))]"
                            : it.status === "pagado"
                            ? "bg-success-soft text-[hsl(var(--success))]"
                            : "bg-accent text-accent-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{it.title}</p>
                        {it.subtitle && (
                          <p className="text-xs text-muted-foreground truncate">{it.subtitle}</p>
                        )}
                      </div>
                      <div className="text-right">
                        {it.amount && (
                          <p className="text-sm font-semibold tabular-nums">
                            {formatCurrency(it.amount)}
                          </p>
                        )}
                        <Badge variant={meta.variant} className="text-[10px] mt-1">
                          {meta.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
