"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, NativeSelect } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/feedback/toast-provider";
import { useAppStore } from "@/lib/store/app-store";
import type { HouseholdDocument } from "@/lib/types";

const CATS: HouseholdDocument["category"][] = [
  "Seguros",
  "Servicios",
  "Impuestos",
  "Identidad",
  "Salud",
  "Vehículo",
];

export function DocumentForm({ onDone }: { onDone?: () => void }) {
  const { addDocument } = useAppStore();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<HouseholdDocument["category"]>("Seguros");
  const [expiresAt, setExpiresAt] = useState("");
  const [fileName, setFileName] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.warning("Falta el concepto", "Ponele un nombre al documento.");
      return;
    }
    const doc: HouseholdDocument = {
      id: `doc-${Date.now()}`,
      title: title.trim(),
      category,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      fileName: fileName || `${title.toLowerCase().replace(/\s+/g, "-")}.pdf`,
      uploadedAt: new Date().toISOString(),
    };
    addDocument(doc);
    toast.success("Documento guardado", title);
    onDone?.();
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Concepto">
        <Input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Póliza seguro auto"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Categoría">
          <NativeSelect
            value={category}
            onChange={(e) => setCategory(e.target.value as HouseholdDocument["category"])}
          >
            {CATS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Vence (opcional)">
          <Input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </Field>
      </div>

      <Field label="Archivo (simulado)" hint="Por ahora no subimos archivos reales — sólo guardamos el nombre.">
        <Input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="poliza.pdf"
        />
      </Field>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>Cancelar</Button>
        <Button type="submit">Guardar</Button>
      </DialogFooter>
    </form>
  );
}
