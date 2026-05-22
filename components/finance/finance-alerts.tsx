"use client";

import { AlertCircle, BellRing, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getExpenseByCategory, getMonthlySummary } from "@/lib/ai/recommendations";
import { subscriptions } from "@/lib/mock/transactions";
import { useTransactions } from "@/lib/store/app-store";
import { cn, formatCurrency } from "@/lib/utils";

export function FinanceAlerts() {
  const all = useTransactions();
  const transactions = all.filter((t) => t.scope !== "personal");
  const { fixedShare, totalIncome, totalFixed } = getMonthlySummary(transactions);
  const byCat = getExpenseByCategory(transactions);
  const delivery = byCat.find((c) => c.category === "Delivery")?.amount ?? 0;
  const supermercado = byCat.find((c) => c.category === "Supermercado")?.amount ?? 0;

  const cards = [
    {
      icon: TrendingUp,
      tone: "bg-warning-soft text-[hsl(var(--warning-foreground))]",
      title: "Delivery subió 24% este mes",
      desc: `Llevás ${formatCurrency(delivery)} en pedidos. Bajarlo a la mitad libera ${formatCurrency(Math.round(delivery / 2))}.`,
    },
    {
      icon: AlertCircle,
      tone: "bg-danger-soft text-[hsl(var(--danger))]",
      title: `Tus gastos fijos son el ${Math.round(fixedShare * 100)}% de tus ingresos`,
      desc: `${formatCurrency(totalFixed)} sobre ${formatCurrency(totalIncome)}. Revisar seguros o planes suele ayudar.`,
    },
    {
      icon: BellRing,
      tone: "bg-accent text-accent-foreground",
      title: `Tenés ${subscriptions.length} suscripciones activas`,
      desc: `Suman ${formatCurrency(subscriptions.reduce((a, s) => a + s.amount, 0))} por mes. Revisar cuáles se usan menos te ahorra plata silenciosa.`,
    },
    {
      icon: TrendingUp,
      tone: "bg-success-soft text-[hsl(var(--success))]",
      title: "Compras de supermercado bajo control",
      desc: `Llevás ${formatCurrency(supermercado)}. Estás dentro del rango habitual.`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.title}>
            <CardContent className="p-4 flex gap-3">
              <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", c.tone)}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{c.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{c.desc}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
