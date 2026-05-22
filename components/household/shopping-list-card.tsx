"use client";

import { Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useActions } from "@/components/forms/action-context";
import { useAppStore } from "@/lib/store/app-store";
import { cn, formatCurrency } from "@/lib/utils";

export function ShoppingListCard() {
  const { state, toggleShoppingItem } = useAppStore();
  const { open } = useActions();
  const items = state.shopping;
  const total = items.filter((i) => !i.bought).reduce((acc, i) => acc + i.estimatedPrice, 0);
  const pendientes = items.filter((i) => !i.bought).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" /> Lista de compras
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {pendientes} ítems pendientes · estimado {formatCurrency(total)}
            </p>
          </div>
          <Button size="sm" variant="soft" className="text-xs" onClick={() => open("shopping")}>
            <Plus className="h-3.5 w-3.5" /> Sumar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5 max-h-96 overflow-y-auto scrollbar-thin">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => toggleShoppingItem(item.id)}
            className="w-full flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/50 transition-colors text-left"
          >
            <span
              className={cn(
                "h-5 w-5 rounded-md border flex items-center justify-center shrink-0",
                item.bought ? "bg-primary border-primary" : "border-input",
              )}
            >
              {item.bought && (
                <svg className="h-3 w-3 text-primary-foreground" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium truncate", item.bought && "line-through text-muted-foreground")}>
                {item.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.quantity} {item.unit ?? ""} · {item.category}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm tabular-nums">{formatCurrency(item.estimatedPrice)}</p>
              {item.priority === "alta" && !item.bought && (
                <Badge variant="warning" className="text-[10px] mt-0.5">Prioritario</Badge>
              )}
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
