"use client";

import { Repeat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from "@/lib/store/app-store";
import { CURRENT_MEMBER_ID } from "@/lib/store/current-user";
import { formatCurrency } from "@/lib/utils";

export function MyRecurring() {
  const transactions = useTransactions();
  const mine = transactions.filter(
    (t) =>
      t.scope === "personal" &&
      t.memberId === CURRENT_MEMBER_ID &&
      (t.isRecurring || t.recurring),
  );

  if (mine.length === 0) return null;

  const total = mine.reduce((acc, t) => acc + t.amount, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Repeat className="h-4 w-4 text-primary" /> Gastos personales recurrentes
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Suman aproximadamente {formatCurrency(total)} cada mes.
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {mine.map((t) => (
          <div key={t.id} className="flex items-center justify-between gap-3 rounded-xl border p-3">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{t.description}</p>
              <p className="text-xs text-muted-foreground">{t.category}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums">{formatCurrency(t.amount)}</p>
              <Badge variant="info" className="text-[10px]">Mensual</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
