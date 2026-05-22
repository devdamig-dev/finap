"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, NativeSelect } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/feedback/toast-provider";
import { useAppStore } from "@/lib/store/app-store";
import type { Account, AccountKind } from "@/lib/types";

const KINDS: { value: AccountKind; label: string }[] = [
  { value: "efectivo", label: "Efectivo" },
  { value: "caja-ahorro", label: "Caja de ahorro" },
  { value: "cuenta-remunerada", label: "Cuenta remunerada" },
  { value: "billetera", label: "Billetera virtual" },
  { value: "dolares", label: "Dólares" },
  { value: "fci", label: "Fondo común" },
  { value: "plazo-fijo", label: "Plazo fijo" },
  { value: "cripto", label: "Cripto" },
];

export function AccountForm({ onDone }: { onDone?: () => void }) {
  const { addAccount } = useAppStore();
  const toast = useToast();

  const [name, setName] = useState("");
  const [kind, setKind] = useState<AccountKind>("caja-ahorro");
  const [balance, setBalance] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning("Falta el nombre", "Ponele un nombre a la cuenta.");
      return;
    }
    const account: Account = {
      id: `acc-${Date.now()}`,
      name: name.trim(),
      kind,
      balance: Number(balance) || 0,
      currency: "ARS",
      isSaving,
      color: "#0d9488",
    };
    addAccount(account);
    toast.success("Cuenta agregada", name);
    onDone?.();
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Nombre de la cuenta">
        <Input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Caja de ahorro Galicia"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Tipo">
          <NativeSelect
            value={kind}
            onChange={(e) => setKind(e.target.value as AccountKind)}
          >
            {KINDS.map((k) => (
              <option key={k.value} value={k.value}>{k.label}</option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Saldo inicial">
          <Input
            type="number"
            min={0}
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="0"
          />
        </Field>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <p className="text-sm font-medium">Marcar como ahorro</p>
          <p className="text-xs text-muted-foreground">Suma al fondo total de ahorro del hogar.</p>
        </div>
        <Switch checked={isSaving} onCheckedChange={setIsSaving} />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>Cancelar</Button>
        <Button type="submit">Agregar cuenta</Button>
      </DialogFooter>
    </form>
  );
}
