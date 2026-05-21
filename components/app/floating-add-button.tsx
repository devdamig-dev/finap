"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingAddButton() {
  return (
    <Button
      size="lg"
      className="fixed lg:absolute right-4 bottom-20 lg:bottom-8 lg:right-8 z-40 h-14 w-14 rounded-full shadow-lg shadow-primary/30 p-0"
      aria-label="Agregar movimiento"
      onClick={() => {
        if (typeof window !== "undefined") {
          window.alert(
            "Próximamente vas a poder cargar acá un gasto, ingreso, tarea o vencimiento en segundos.",
          );
        }
      }}
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
}
