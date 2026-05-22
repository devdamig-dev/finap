"use client";

import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTransactions } from "@/lib/store/app-store";
import { CURRENT_MEMBER_ID, CURRENT_MEMBER_NAME } from "@/lib/store/current-user";
import { personalBudgets, members } from "@/lib/mock/members";
import { formatCurrency, percentage } from "@/lib/utils";

interface PersonalRec {
  id: string;
  title: string;
  description: string;
  tone: "warning" | "info" | "success";
}

function generate(): PersonalRec[] {
  return [];
}
void generate;

export function MyRecommendations() {
  const transactions = useTransactions();
  const mine = transactions.filter(
    (t) => t.scope === "personal" && t.memberId === CURRENT_MEMBER_ID && t.type === "gasto",
  );
  const spent = mine.reduce((acc, t) => acc + t.amount, 0);
  const budget =
    personalBudgets.find((p) => p.memberId === CURRENT_MEMBER_ID)?.monthlyBudget ??
    members.find((m) => m.id === CURRENT_MEMBER_ID)?.personalBudget ??
    0;

  const byCat = new Map<string, number>();
  for (const t of mine) byCat.set(t.category, (byCat.get(t.category) ?? 0) + t.amount);
  const top = Array.from(byCat.entries())
    .map(([c, a]) => ({ category: c, amount: a }))
    .sort((a, b) => b.amount - a.amount)[0];

  const recs: PersonalRec[] = [];

  if (budget > 0 && spent > budget) {
    recs.push({
      id: "over",
      title: `Superaste tu presupuesto en ${formatCurrency(spent - budget)}`,
      description:
        top && spent > 0
          ? `${top.category} explica buena parte de lo gastado este mes. Revisar esa categoría puede ayudarte a volver a ritmo.`
          : "Buen momento para repasar gastos chicos que se acumulan.",
      tone: "warning",
    });
  } else if (budget > 0 && spent <= budget * 0.6 && spent > 0) {
    recs.push({
      id: "ok",
      title: "Estás dentro de tu presupuesto personal",
      description: `Gastaste ${formatCurrency(spent)} de ${formatCurrency(budget)}. Te sobra margen para el resto del mes.`,
      tone: "success",
    });
  }

  if (top && spent > 0) {
    const share = percentage(top.amount, spent);
    if (share >= 25 && (top.category === "Cafetería" || top.category === "Delivery")) {
      recs.push({
        id: "top-cat",
        title: `${top.category} representa el ${share}% de tus gastos personales`,
        description: `Bajar 2 consumos por semana en ${top.category.toLowerCase()} puede liberarte unos ${formatCurrency(Math.round(top.amount * 0.25))}.`,
        tone: "info",
      });
    }
  }

  recs.push({
    id: "priv",
    title: "Tus gastos personales son privados por defecto",
    description:
      "Separarlos de los del hogar te ayuda a leer mejor el presupuesto familiar. Esto no es asesoramiento financiero.",
    tone: "info",
  });

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold tracking-tight px-1">
        Recomendaciones para {CURRENT_MEMBER_NAME}
      </p>
      {recs.map((r) => (
        <Card key={r.id}>
          <CardContent className="p-4 flex gap-3">
            <div
              className={
                r.tone === "warning"
                  ? "h-9 w-9 shrink-0 rounded-lg bg-warning-soft text-[hsl(var(--warning-foreground))] flex items-center justify-center"
                  : r.tone === "success"
                  ? "h-9 w-9 shrink-0 rounded-lg bg-success-soft text-[hsl(var(--success))] flex items-center justify-center"
                  : "h-9 w-9 shrink-0 rounded-lg bg-accent text-accent-foreground flex items-center justify-center"
              }
            >
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{r.title}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{r.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
