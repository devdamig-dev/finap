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
import type { PlannedPurchase, PlannedPurchaseCategory } from "@/lib/types";

const CATS: PlannedPurchaseCategory[] = [
  "Supermercado",
  "Limpieza",
  "Farmacia",
  "Mascotas",
  "Hogar",
  "Escolar",
  "Otros",
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Form para cargar una compra PREVISTA (bloque), no un producto individual.
 * Ejemplo: "Supermercado semanal — $60.000" en vez de "leche, pan, detergente".
 */
export function ShoppingForm({ onDone }: { onDone?: () => void }) {
  const { addPurchase } = useAppStore();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<PlannedPurchaseCategory>("Supermercado");
  const [estimatedAmount, setEstimatedAmount] = useState("");
  const [plannedDate, setPlannedDate] = useState(todayISO());
  const [responsible, setResponsible] = useState(members[0].name);
  const [notes, setNotes] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.warning("Falta el concepto", "Ej: Supermercado semanal");
      return;
    }
    const value = Number(estimatedAmount);
    if (!value || value <= 0) {
      toast.warning("Falta el monto estimado", "Ingresá un valor mayor a 0.");
      return;
    }
    const purchase: PlannedPurchase = {
      id: `pp-${Date.now()}`,
      title: title.trim(),
      category,
      estimatedAmount: value,
      plannedDate: new Date(plannedDate).toISOString(),
      responsible,
      status: "prevista",
      notes: notes.trim() || undefined,
    };
    addPurchase(purchase);
    toast.success("Compra prevista cargada", `${title} · estimado.`);
    onDone?.();
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Concepto" hint="Pensá en bloques: 'Supermercado semanal', 'Farmacia del mes', 'Compra escolar'.">
        <Input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Supermercado semanal"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Categoría">
          <NativeSelect
            value={category}
            onChange={(e) => setCategory(e.target.value as PlannedPurchaseCategory)}
          >
            {CATS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Monto estimado">
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            step={1000}
            value={estimatedAmount}
            onChange={(e) => setEstimatedAmount(e.target.value)}
            placeholder="60000"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Fecha prevista">
          <Input
            type="date"
            value={plannedDate}
            onChange={(e) => setPlannedDate(e.target.value)}
          />
        </Field>
        <Field label="Responsable">
          <NativeSelect value={responsible} onChange={(e) => setResponsible(e.target.value)}>
            {members.map((m) => (
              <option key={m.id} value={m.name}>{m.name}</option>
            ))}
          </NativeSelect>
        </Field>
      </div>

      <Field label="Nota (opcional)">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Detalle, dónde comprar, qué incluye..."
        />
      </Field>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>Cancelar</Button>
        <Button type="submit">Registrar compra</Button>
      </DialogFooter>
    </form>
  );
}
