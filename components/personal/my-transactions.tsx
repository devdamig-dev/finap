"use client";

import { useMemo, useState } from "react";
import { ArrowDownLeft, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from "@/lib/store/app-store";
import { CURRENT_MEMBER_ID } from "@/lib/store/current-user";
import { personalCategories } from "@/lib/mock/categories";
import type { TransactionCategory } from "@/lib/types";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

export function MyTransactions() {
  const transactions = useTransactions();
  const [filter, setFilter] = useState<"todas" | TransactionCategory>("todas");

  const mine = useMemo(
    () =>
      transactions
        .filter(
          (t) => t.scope === "personal" && t.memberId === CURRENT_MEMBER_ID && t.type === "gasto",
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions],
  );

  const list = filter === "todas" ? mine : mine.filter((t) => t.category === filter);
  const total = list.reduce((acc, t) => acc + t.amount, 0);

  const categoriesPresent = Array.from(new Set(mine.map((t) => t.category)));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <CardTitle>Mis movimientos</CardTitle>
            <p className="text-xs text-muted-foreground">
              Total {filter === "todas" ? "del mes" : `en ${filter}`}: {" "}
              <span className="font-medium text-foreground">{formatCurrency(total)}</span>
            </p>
          </div>
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Filtrar
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          <FilterChip
            active={filter === "todas"}
            onClick={() => setFilter("todas")}
            label="Todas"
          />
          {personalCategories
            .filter((c) => categoriesPresent.includes(c))
            .map((c) => (
              <FilterChip
                key={c}
                active={filter === c}
                onClick={() => setFilter(c)}
                label={c}
              />
            ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {list.length === 0 && (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Todavía no cargaste gastos personales{filter !== "todas" ? ` en ${filter}` : ""}.
          </p>
        )}
        {list.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/50 transition-colors"
          >
            <div className="h-9 w-9 rounded-lg bg-danger-soft text-[hsl(var(--danger))] flex items-center justify-center shrink-0">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{t.description}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="truncate">{t.category}</span>
                {t.isRecurring && (
                  <Badge variant="info" className="text-[10px]">Recurrente</Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums">-{formatCurrency(t.amount)}</p>
              <p className="text-[10px] text-muted-foreground">{formatDate(t.date)}</p>
            </div>
          </div>
        ))}
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
