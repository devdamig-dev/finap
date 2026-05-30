"use client";

import { useMemo, useState } from "react";
import { Ban, Check, CheckCircle2, Clock, Plus, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/feedback/toast-provider";
import { useActions } from "@/components/forms/action-context";
import { useAppStore, usePurchases } from "@/lib/store/app-store";
import type { PlannedPurchase, PlannedPurchaseStatus } from "@/lib/types";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const STATUS_META: Record<
  PlannedPurchaseStatus,
  { label: string; variant: "info" | "success" | "warning"; icon: typeof Clock }
> = {
  prevista: { label: "Prevista", variant: "info", icon: Clock },
  realizada: { label: "Realizada", variant: "success", icon: CheckCircle2 },
  cancelada: { label: "Cancelada", variant: "warning", icon: Ban },
};

export function PlannedPurchasesCard() {
  const purchases = usePurchases();
  const { completePurchase, cancelPurchase } = useAppStore();
  const { open } = useActions();
  const toast = useToast();
  const [filter, setFilter] = useState<PlannedPurchaseStatus | "todas">("prevista");

  const list = useMemo(() => {
    const sorted = [...purchases].sort(
      (a, b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime(),
    );
    return filter === "todas" ? sorted : sorted.filter((p) => p.status === filter);
  }, [purchases, filter]);

  const previstas = purchases.filter((p) => p.status === "prevista");
  const totalEstimado = previstas.reduce((acc, p) => acc + p.estimatedAmount, 0);

  function handleComplete(p: PlannedPurchase) {
    const txId = completePurchase(p.id);
    if (txId) {
      toast.success(
        "Compra registrada como gasto",
        `${p.title} se sumó a los movimientos del hogar.`,
      );
    }
  }

  function handleCancel(p: PlannedPurchase) {
    cancelPurchase(p.id);
    toast.info("Compra cancelada", p.title);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" /> Compras previstas
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {previstas.length} compras planificadas · estimado {formatCurrency(totalEstimado)}
            </p>
          </div>
          <Button size="sm" variant="soft" className="text-xs" onClick={() => open("shopping")}>
            <Plus className="h-3.5 w-3.5" /> Registrar compra
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          <FilterChip active={filter === "prevista"} onClick={() => setFilter("prevista")} label="Previstas" />
          <FilterChip active={filter === "realizada"} onClick={() => setFilter("realizada")} label="Realizadas" />
          <FilterChip active={filter === "cancelada"} onClick={() => setFilter("cancelada")} label="Canceladas" />
          <FilterChip active={filter === "todas"} onClick={() => setFilter("todas")} label="Todas" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[28rem] overflow-y-auto scrollbar-thin">
        {list.length === 0 && (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No hay compras {filter !== "todas" ? STATUS_META[filter].label.toLowerCase() + "s" : ""}.
          </p>
        )}
        {list.map((p) => {
          const meta = STATUS_META[p.status];
          const StatusIcon = meta.icon;
          const isPrevista = p.status === "prevista";
          return (
            <div key={p.id} className="rounded-xl border p-3 space-y-2">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                    isPrevista
                      ? "bg-accent text-accent-foreground"
                      : p.status === "realizada"
                      ? "bg-success-soft text-[hsl(var(--success))]"
                      : "bg-warning-soft text-[hsl(var(--warning-foreground))]",
                  )}
                >
                  <StatusIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.title}</p>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <Badge variant="outline" className="text-[10px]">{p.category}</Badge>
                    <span>·</span>
                    <span>{formatDate(p.plannedDate)}</span>
                    {p.responsible && (
                      <>
                        <span>·</span>
                        <span>{p.responsible}</span>
                      </>
                    )}
                  </div>
                  {p.notes && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.notes}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold tabular-nums">
                    {formatCurrency(p.estimatedAmount)}
                  </p>
                  <Badge variant={meta.variant} className="text-[10px] mt-0.5">
                    {meta.label}
                  </Badge>
                </div>
              </div>
              {isPrevista && (
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-xs text-muted-foreground"
                    onClick={() => handleCancel(p)}
                  >
                    Cancelar
                  </Button>
                  <Button type="button" size="sm" onClick={() => handleComplete(p)}>
                    <Check className="h-3.5 w-3.5" /> Marcar como realizada
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card hover:bg-muted",
      )}
    >
      {label}
    </button>
  );
}
