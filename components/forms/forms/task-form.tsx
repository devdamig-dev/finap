"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, NativeSelect } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/feedback/toast-provider";
import { useAppStore } from "@/lib/store/app-store";
import { members } from "@/lib/mock/members";
import type { HouseholdTask, TaskPriority } from "@/lib/types";

const AREAS = ["general", "limpieza", "mantenimiento", "compras", "pagos"] as const;
const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: "alta", label: "Alta" },
  { value: "media", label: "Media" },
  { value: "baja", label: "Baja" },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function TaskForm({ onDone }: { onDone?: () => void }) {
  const { addTask } = useAppStore();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [responsible, setResponsible] = useState(members[0].name);
  const [dueDate, setDueDate] = useState(todayISO());
  const [area, setArea] = useState<(typeof AREAS)[number]>("general");
  const [priority, setPriority] = useState<TaskPriority>("media");
  const [description, setDescription] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.warning("Falta el título", "Ponele un nombre a la tarea.");
      return;
    }
    const task: HouseholdTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      status: "pendiente",
      priority,
      dueDate: new Date(dueDate).toISOString(),
      responsible,
      area,
    };
    addTask(task);
    toast.success("Tarea creada", `Asignada a ${responsible}.`);
    onDone?.();
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Título">
        <Input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Cambiar filtro del aire"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Responsable">
          <NativeSelect value={responsible} onChange={(e) => setResponsible(e.target.value)}>
            {members.map((m) => (
              <option key={m.id} value={m.name}>{m.name}</option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Fecha">
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Área">
          <NativeSelect
            value={area}
            onChange={(e) => setArea(e.target.value as (typeof AREAS)[number])}
          >
            {AREAS.map((a) => (
              <option key={a} value={a} className="capitalize">{a}</option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Prioridad">
          <NativeSelect
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </NativeSelect>
        </Field>
      </div>

      <Field label="Nota (opcional)">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </Field>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>Cancelar</Button>
        <Button type="submit">Crear tarea</Button>
      </DialogFooter>
    </form>
  );
}
