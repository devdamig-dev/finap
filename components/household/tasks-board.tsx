"use client";

import { useMemo, useState } from "react";
import { Check, Clock, CircleDot, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { tasks as mockTasks } from "@/lib/mock/tasks";
import type { HouseholdTask, TaskStatus } from "@/lib/types";
import { cn, daysUntil, formatDate } from "@/lib/utils";

const statusOrder: TaskStatus[] = ["vencido", "pendiente", "en-progreso", "completado"];

const statusMeta: Record<
  TaskStatus,
  { label: string; tone: string; icon: typeof Check; variant: "danger" | "warning" | "info" | "success" }
> = {
  vencido: { label: "Vencido", tone: "text-[hsl(var(--danger))]", icon: AlertCircle, variant: "danger" },
  pendiente: { label: "Pendiente", tone: "text-[hsl(var(--warning-foreground))]", icon: Clock, variant: "warning" },
  "en-progreso": { label: "En progreso", tone: "text-primary", icon: CircleDot, variant: "info" },
  completado: { label: "Hecho", tone: "text-[hsl(var(--success))]", icon: Check, variant: "success" },
};

function deriveStatus(t: HouseholdTask): TaskStatus {
  if (t.status === "completado") return "completado";
  if (t.dueDate && daysUntil(t.dueDate) < 0) return "vencido";
  return t.status;
}

export function TasksBoard() {
  const [filter, setFilter] = useState<"todas" | TaskStatus>("todas");

  const grouped = useMemo(() => {
    const list = mockTasks.map((t) => ({ ...t, status: deriveStatus(t) }));
    return list;
  }, []);

  const visible = filter === "todas" ? grouped : grouped.filter((t) => t.status === filter);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <CardTitle>Tareas del hogar</CardTitle>
            <p className="text-xs text-muted-foreground">Asignadas a cada integrante</p>
          </div>
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mt-3">
          <TabsList className="flex-wrap h-auto bg-muted/60">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            {statusOrder.map((s) => (
              <TabsTrigger key={s} value={s} className="capitalize">
                {statusMeta[s].label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="space-y-2">
        {visible.length === 0 && (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Sin tareas en esta categoría.
          </p>
        )}
        {visible.map((task) => {
          const meta = statusMeta[task.status];
          const Icon = meta.icon;
          return (
            <div
              key={task.id}
              className="flex items-start gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/30"
            >
              <button
                type="button"
                aria-label="Marcar como hecho"
                className={cn(
                  "h-5 w-5 mt-0.5 rounded-md border flex items-center justify-center shrink-0",
                  task.status === "completado"
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-input",
                )}
              >
                {task.status === "completado" && <Check className="h-3 w-3" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      task.status === "completado" && "line-through text-muted-foreground",
                    )}
                  >
                    {task.title}
                  </p>
                  <Badge variant={meta.variant} className="text-[10px] shrink-0">
                    <Icon className={cn("h-3 w-3 mr-1", meta.tone)} />
                    {meta.label}
                  </Badge>
                </div>
                {task.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>{task.responsible}</span>
                  {task.dueDate && <span>· {formatDate(task.dueDate)}</span>}
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {task.area}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
