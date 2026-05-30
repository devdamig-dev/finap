"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, NativeSelect } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/feedback/toast-provider";
import { useAppStore } from "@/lib/store/app-store";
import type { ShoppingItem, ShoppingPriority } from "@/lib/types";

const CATS: ShoppingItem["category"][] = [
  "Almacén",
  "Limpieza",
  "Frescos",
  "Bebidas",
  "Higiene",
  "Otros",
];
const PRIORITIES: ShoppingPriority[] = ["alta", "media", "baja"];

export function ShoppingForm({ onDone }: { onDone?: () => void }) {
  const { addShoppingItem } = useAppStore();
  const toast = useToast();

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("u");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [category, setCategory] = useState<ShoppingItem["category"]>("Almacén");
  const [priority, setPriority] = useState<ShoppingPriority>("media");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning("Falta el producto", "Decinos qué hay que comprar.");
      return;
    }
    const item: ShoppingItem = {
      id: `sh-${Date.now()}`,
      name: name.trim(),
      quantity: Number(quantity) || 1,
      unit: unit || undefined,
      estimatedPrice: Number(estimatedPrice) || 0,
      category,
      priority,
      bought: false,
    };
    addShoppingItem(item);
    toast.success("Sumado a la lista", item.name);
    onDone?.();
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Producto">
        <Input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Leche entera"
        />
      </Field>

      <div className="grid grid-cols-3 gap-3">
        <Field label="Cantidad">
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Field>
        <Field label="Unidad">
          <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="u / kg / L" />
        </Field>
        <Field label="Precio est.">
          <Input
            type="number"
            min={0}
            value={estimatedPrice}
            onChange={(e) => setEstimatedPrice(e.target.value)}
            placeholder="0"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Categoría">
          <NativeSelect
            value={category}
            onChange={(e) => setCategory(e.target.value as ShoppingItem["category"])}
          >
            {CATS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Prioridad">
          <NativeSelect
            value={priority}
            onChange={(e) => setPriority(e.target.value as ShoppingPriority)}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p} className="capitalize">{p}</option>
            ))}
          </NativeSelect>
        </Field>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>Cancelar</Button>
        <Button type="submit">Sumar</Button>
      </DialogFooter>
    </form>
  );
}
