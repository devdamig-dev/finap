"use client";

import { useState } from "react";
import { Plus, Receipt, ListChecks, Calendar, ShoppingCart, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActions } from "@/components/forms/action-context";
import { cn } from "@/lib/utils";

export function FloatingAddButton() {
  const { open: openAction } = useActions();
  const [open, setOpen] = useState(false);

  const options = [
    { label: "Movimiento", icon: Wallet, onClick: () => openAction("transaction") },
    { label: "Gasto personal", icon: Receipt, onClick: () => openAction("personal-expense") },
    { label: "Tarea", icon: ListChecks, onClick: () => openAction("task") },
    { label: "Vencimiento", icon: Calendar, onClick: () => openAction("bill") },
    { label: "Compra", icon: ShoppingCart, onClick: () => openAction("shopping") },
  ];

  return (
    <>
      {open && (
        <button
          aria-hidden
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-transparent"
        />
      )}
      <div className="fixed lg:absolute right-4 bottom-20 lg:bottom-8 lg:right-8 z-40 flex flex-col items-end gap-2">
        <div
          className={cn(
            "flex flex-col gap-2 transition-all",
            open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
          )}
        >
          {options.map((o) => {
            const Icon = o.icon;
            return (
              <button
                key={o.label}
                type="button"
                onClick={() => {
                  setOpen(false);
                  o.onClick();
                }}
                className="inline-flex items-center gap-2 rounded-full bg-card border px-4 py-2 text-sm font-medium shadow-md hover:bg-muted transition-colors"
              >
                <Icon className="h-4 w-4 text-primary" />
                {o.label}
              </button>
            );
          })}
        </div>
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg shadow-primary/30 p-0"
          aria-label="Agregar"
          onClick={() => setOpen((v) => !v)}
        >
          <Plus className={cn("h-6 w-6 transition-transform", open && "rotate-45")} />
        </Button>
      </div>
    </>
  );
}
