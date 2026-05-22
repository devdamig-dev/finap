"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, NativeSelect } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/feedback/toast-provider";
import { useAppStore } from "@/lib/store/app-store";
import { householdCategories } from "@/lib/mock/categories";
import { members } from "@/lib/mock/members";
import type { Bill, TransactionCategory } from "@/lib/types";

function inDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function BillForm({ onDone }: { onDone?: () => void }) {
  const { addBill } = useAppStore();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(inDays(7));
  const [category, setCategory] = useState<TransactionCategory>("Servicios");
  const [responsible, setResponsible] = useState(members[0].name);
  const [autoDebit, setAutoDebit] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.warning("Falta el concepto", "Decinos qué se vence.");
      return;
    }
    const value = Number(amount);
    if (!value || value <= 0) {
      toast.warning("Falta el monto", "Ingresá un monto mayor a 0.");
      return;
    }
    const bill: Bill = {
      id: `bill-${Date.now()}`,
      title: title.trim(),
      category,
      amount: value,
      dueDate: new Date(dueDate).toISOString(),
      status: "pendiente",
      autoDebit,
      responsible,
    };
    addBill(bill);
    toast.success("Vencimiento agregado", `Vence el ${new Date(dueDate).toLocaleDateString("es-AR")}.`);
    onDone?.();
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Concepto">
        <Input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Edesur — Electricidad"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Monto">
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
          />
        </Field>
        <Field label="Vence el">
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Categoría">
          <NativeSelect
            value={category}
            onChange={(e) => setCategory(e.target.value as TransactionCategory)}
          >
            {householdCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Responsable">
          <NativeSelect value={responsible} onChange={(e) => setResponsible(e.target.value)}>
            {members.map((m) => (
              <option key={m.id} value={m.name}>{m.name}</option>
            ))}
          </NativeSelect>
        </Field>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <p className="text-sm font-medium">Débito automático</p>
          <p className="text-xs text-muted-foreground">¿Se paga solo?</p>
        </div>
        <Switch checked={autoDebit} onCheckedChange={setAutoDebit} />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>Cancelar</Button>
        <Button type="submit">Agregar vencimiento</Button>
      </DialogFooter>
    </form>
  );
}
