"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, NativeSelect } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/feedback/toast-provider";
import { useAppStore } from "@/lib/store/app-store";
import { CURRENT_MEMBER_ID } from "@/lib/store/current-user";
import {
  householdCategories,
  incomeCategories,
  personalCategories,
  savingsCategories,
} from "@/lib/mock/categories";
import { members } from "@/lib/mock/members";
import type { ActionDefaults } from "@/components/forms/action-context";
import type {
  PaymentMethod,
  Transaction,
  TransactionCategory,
  TransactionScope,
  TransactionType,
} from "@/lib/types";

const TYPE_OPTIONS: { value: TransactionType; label: string }[] = [
  { value: "gasto", label: "Gasto" },
  { value: "ingreso", label: "Ingreso" },
  { value: "transferencia", label: "Transferencia" },
  { value: "ahorro", label: "Ahorro" },
  { value: "inversion", label: "Inversión" },
];

const SCOPE_OPTIONS: { value: TransactionScope; label: string }[] = [
  { value: "hogar", label: "Hogar" },
  { value: "personal", label: "Personal" },
  { value: "compartido", label: "Compartido" },
];

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: "efectivo", label: "Efectivo" },
  { value: "debito", label: "Débito" },
  { value: "credito", label: "Crédito" },
  { value: "transferencia", label: "Transferencia" },
  { value: "mercadopago", label: "Mercado Pago" },
  { value: "cripto", label: "Cripto" },
  { value: "otro", label: "Otro" },
];

interface Props {
  defaults?: ActionDefaults;
  onDone?: () => void;
  lockedType?: boolean;
  lockedScope?: boolean;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function TransactionForm({ defaults, onDone, lockedType, lockedScope }: Props) {
  const { addTransaction } = useAppStore();
  const toast = useToast();
  const { accounts } = useAppStore().state;

  const [type, setType] = useState<TransactionType>(defaults?.type ?? "gasto");
  const [scope, setScope] = useState<TransactionScope>(defaults?.scope ?? "hogar");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>(todayISO());
  const [memberId, setMemberId] = useState<string>(
    scope === "personal" ? CURRENT_MEMBER_ID : "",
  );
  const [accountId, setAccountId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("debito");
  const [isRecurring, setIsRecurring] = useState(false);
  const [notes, setNotes] = useState<string>("");

  const categoryList: TransactionCategory[] = useMemo(() => {
    if (type === "ingreso") return incomeCategories;
    if (type === "ahorro" || type === "inversion") return savingsCategories;
    if (scope === "personal") return personalCategories;
    return householdCategories;
  }, [type, scope]);

  const [category, setCategory] = useState<TransactionCategory>(categoryList[0]);

  // Reset categoría si cambia la lista
  useMemo(() => {
    if (!categoryList.includes(category)) {
      setCategory(categoryList[0]);
    }
  }, [categoryList, category]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) {
      toast.warning("Falta el monto", "Ingresá un monto mayor a 0 para guardar.");
      return;
    }

    const finalScope: TransactionScope = lockedScope ? defaults?.scope ?? "personal" : scope;
    const finalMemberId =
      finalScope === "personal" ? CURRENT_MEMBER_ID : memberId || undefined;

    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      type: lockedType ? defaults?.type ?? type : type,
      kind: type === "gasto" ? (isRecurring ? "fijo" : "variable") : undefined,
      category,
      description: description || category,
      amount: value,
      date: new Date(date).toISOString(),
      accountId: accountId || undefined,
      scope: finalScope,
      memberId: finalMemberId,
      isRecurring,
      recurring: isRecurring,
      paymentMethod,
      notes: notes || undefined,
    };

    addTransaction(tx);
    toast.success(
      finalScope === "personal" ? "Gasto personal cargado" : "Movimiento cargado",
      finalScope === "personal"
        ? "Lo vas a ver en Mis gastos."
        : "Aparece arriba de tus movimientos.",
    );
    onDone?.();
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tipo">
          <NativeSelect
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType)}
            disabled={lockedType}
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Alcance">
          <NativeSelect
            value={scope}
            onChange={(e) => setScope(e.target.value as TransactionScope)}
            disabled={lockedScope}
          >
            {SCOPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </NativeSelect>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Monto">
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            step={100}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            autoFocus
          />
        </Field>
        <Field label="Fecha">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
      </div>

      <Field label="Categoría">
        <NativeSelect
          value={category}
          onChange={(e) => setCategory(e.target.value as TransactionCategory)}
        >
          {categoryList.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </NativeSelect>
      </Field>

      <Field label="Descripción">
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={`Ej: ${category === "Supermercado" ? "Coto fin de semana" : category}`}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Cuenta">
          <NativeSelect value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            <option value="">Sin especificar</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Medio de pago">
          <NativeSelect
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          >
            {PAYMENT_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </NativeSelect>
        </Field>
      </div>

      {scope !== "personal" && (
        <Field label="Responsable (opcional)">
          <NativeSelect value={memberId} onChange={(e) => setMemberId(e.target.value)}>
            <option value="">Sin asignar</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </NativeSelect>
        </Field>
      )}

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <p className="text-sm font-medium">¿Es recurrente?</p>
          <p className="text-xs text-muted-foreground">Si se repite todos los meses</p>
        </div>
        <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
      </div>

      <Field label="Nota (opcional)">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Detalle, comprobante, etc."
          rows={2}
        />
      </Field>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </DialogFooter>
    </form>
  );
}
