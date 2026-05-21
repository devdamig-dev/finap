"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getExpenseByCategory } from "@/lib/ai/recommendations";
import { transactions } from "@/lib/mock/transactions";
import { formatCurrency } from "@/lib/utils";

const palette = [
  "#0d9488",
  "#0ea5e9",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#14b8a6",
  "#6366f1",
  "#ec4899",
  "#84cc16",
  "#f97316",
];

export function ExpenseCategoryChart() {
  const data = getExpenseByCategory(transactions).slice(0, 8);
  const total = data.reduce((acc, d) => acc + d.amount, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Gastos por categoría</CardTitle>
        <p className="text-xs text-muted-foreground">Distribución del mes</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={48}
                  outerRadius={80}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={palette[i % palette.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => formatCurrency(v)}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(var(--border))",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total</p>
                <p className="text-sm font-semibold tabular-nums">{formatCurrency(total)}</p>
              </div>
            </div>
          </div>
          <ul className="space-y-2">
            {data.slice(0, 6).map((item, i) => (
              <li key={item.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: palette[i % palette.length] }}
                  />
                  <span className="truncate">{item.category}</span>
                </div>
                <span className="text-muted-foreground tabular-nums text-xs">
                  {Math.round((item.amount / total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
