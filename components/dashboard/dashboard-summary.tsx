"use client";

import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTransactions } from "@/lib/store/app-store";
import { getMonthlySummary } from "@/lib/ai/recommendations";
import { cn, formatCurrency } from "@/lib/utils";

export function DashboardSummary() {
  const transactions = useTransactions();
  // El resumen del hogar no incluye gastos personales individuales
  const household = transactions.filter((t) => t.scope !== "personal");
  const { totalIncome, totalExpense, balance } = getMonthlySummary(household);

  const items = [
    {
      label: "Ingresos",
      value: totalIncome,
      icon: ArrowUpRight,
      color: "text-[hsl(var(--success))]",
      bg: "bg-success-soft",
    },
    {
      label: "Gastos del hogar",
      value: totalExpense,
      icon: ArrowDownRight,
      color: "text-[hsl(var(--danger))]",
      bg: "bg-danger-soft",
    },
    {
      label: "Saldo estimado",
      value: balance,
      icon: Wallet,
      color: balance >= 0 ? "text-primary" : "text-[hsl(var(--danger))]",
      bg: "bg-accent",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center", item.bg)}>
                  <Icon className={cn("h-4 w-4", item.color)} />
                </div>
              </div>
              <p className={cn("text-lg lg:text-xl font-semibold mt-2 tabular-nums", item.color)}>
                {formatCurrency(item.value)}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
