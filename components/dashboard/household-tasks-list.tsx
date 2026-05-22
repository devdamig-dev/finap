"use client";

import Link from "next/link";
import { ArrowRight, Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTasks } from "@/lib/store/app-store";
import type { HouseholdTask, TaskStatus } from "@/lib/types";
import { cn, daysUntil, formatDate } from "@/lib/utils";

const statusStyles: Record<TaskStatus, { label: string; variant: "warning" | "info" | "success" | "danger" }> = {
  pendiente: { label: "Pendiente", variant: "warning" },
  "en-progreso": { label: "En progreso", variant: "info" },
  completado: { label: "Hecho", variant: "success" },
  vencido: { label: "Vencido", variant: "danger" },
};

function deriveStatus(t: HouseholdTask): TaskStatus {
  if (t.status === "completado") return "completado";
  if (t.dueDate && daysUntil(t.dueDate) < 0) return "vencido";
  return t.status;
}

export function HouseholdTasksList({ limit = 4 }: { limit?: number }) {
  const tasks = useTasks();
  const list = tasks
    .filter((t) => t.status !== "completado")
    .sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""))
    .slice(0, limit);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle>Tareas del hogar</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Lo que está abierto en casa
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
        {list.map((task) => {
          const status = deriveStatus(task);
          const style = statusStyles[status];
          return (
            <div key={task.id} className="flex items-center gap-3 rounded-xl border p-3">
              <div
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                  status === "completado"
                    ? "bg-success-soft text-[hsl(var(--success))]"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {status === "completado" ? <Check className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{task.title}</p>
                <p className="text-xs text-muted-foreground">
                  {task.responsible}{task.dueDate ? ` · ${formatDate(task.dueDate)}` : ""}
                </p>
              </div>
              <Badge variant={style.variant} className="text-[10px]">{style.label}</Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
