"use client";

import { Plus } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { DocumentsCard } from "@/components/household/documents-card";
import { MaintenanceList } from "@/components/household/maintenance-list";
import { ShoppingListCard } from "@/components/household/shopping-list-card";
import { TasksBoard } from "@/components/household/tasks-board";
import { useActions } from "@/components/forms/action-context";

export default function HogarPage() {
  const { open } = useActions();
  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Hogar"
        description="Tareas, compras, mantenimiento y documentos. La logística de la casa, ordenada."
        action={
          <Button size="sm" className="hidden sm:flex" onClick={() => open("task")}>
            <Plus className="h-4 w-4" /> Crear tarea
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TasksBoard />
        <ShoppingListCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MaintenanceList />
        <DocumentsCard />
      </div>
    </div>
  );
}
