"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useActions } from "@/components/forms/action-context";
import { AccountForm } from "@/components/forms/forms/account-form";
import { BillForm } from "@/components/forms/forms/bill-form";
import { DocumentForm } from "@/components/forms/forms/document-form";
import { ShoppingForm } from "@/components/forms/forms/shopping-form";
import { TaskForm } from "@/components/forms/forms/task-form";
import { TransactionForm } from "@/components/forms/forms/transaction-form";

const TITLES = {
  transaction: { title: "Nuevo movimiento", description: "Cargá un gasto, ingreso, ahorro o transferencia." },
  expense: { title: "Cargar gasto", description: "Sumá un gasto al hogar." },
  income: { title: "Cargar ingreso", description: "Registrá un ingreso del hogar." },
  "personal-expense": { title: "Agregar gasto personal", description: "Sólo vos vas a ver este gasto en detalle." },
  task: { title: "Crear tarea", description: "Asignala a alguien del hogar." },
  bill: { title: "Agregar vencimiento", description: "Servicios, cuotas, resúmenes." },
  shopping: { title: "Nueva compra", description: "Sumá un ítem a la lista del hogar." },
  document: { title: "Sumar factura o documento", description: "Mantené todo lo importante a mano." },
  account: { title: "Agregar cuenta o bolsillo", description: "Dónde el hogar guarda y mueve la plata." },
} as const;

export function ActionModalRoot() {
  const { current, close } = useActions();
  const open = current !== null;

  const type = current?.type;
  const meta = type ? TITLES[type] : null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && close()}>
      <DialogContent>
        {meta && (
          <DialogHeader>
            <DialogTitle>{meta.title}</DialogTitle>
            <DialogDescription>{meta.description}</DialogDescription>
          </DialogHeader>
        )}
        {type === "transaction" && <TransactionForm defaults={current?.defaults} onDone={close} />}
        {type === "expense" && (
          <TransactionForm
            defaults={{ ...current?.defaults, type: "gasto" }}
            onDone={close}
            lockedType
          />
        )}
        {type === "income" && (
          <TransactionForm
            defaults={{ ...current?.defaults, type: "ingreso" }}
            onDone={close}
            lockedType
          />
        )}
        {type === "personal-expense" && (
          <TransactionForm
            defaults={{ type: "gasto", scope: "personal" }}
            onDone={close}
            lockedType
            lockedScope
          />
        )}
        {type === "task" && <TaskForm onDone={close} />}
        {type === "bill" && <BillForm onDone={close} />}
        {type === "shopping" && <ShoppingForm onDone={close} />}
        {type === "document" && <DocumentForm onDone={close} />}
        {type === "account" && <AccountForm onDone={close} />}
      </DialogContent>
    </Dialog>
  );
}
