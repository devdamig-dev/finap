"use client";

import { useMemo, useState } from "react";
import { ArrowDownLeft, Sparkles, UserCircle2, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { members, personalBudgets } from "@/lib/mock/members";
import { personalExpenses } from "@/lib/mock/personal-expenses";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

type Selection = "todos" | string; // memberId or "todos"

export function PersonalExpenses() {
  const [selected, setSelected] = useState<Selection>("todos");

  const list = useMemo(() => {
    const filtered =
      selected === "todos"
        ? personalExpenses
        : personalExpenses.filter((t) => t.memberId === selected);
    return [...filtered].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [selected]);

  const total = list.reduce((acc, t) => acc + t.amount, 0);

  const byMember = members.map((m) => {
    const spent = personalExpenses
      .filter((t) => t.memberId === m.id)
      .reduce((acc, t) => acc + t.amount, 0);
    const budget = personalBudgets.find((p) => p.memberId === m.id)?.monthlyBudget ?? m.personalBudget ?? 0;
    return { member: m, spent, budget };
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <UserCircle2 className="h-4 w-4 text-primary" /> Gastos personales del mes
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Separar gastos personales del presupuesto del hogar ayuda a leer mejor las
            finanzas familiares.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={selected === "todos"}
              onClick={() => setSelected("todos")}
              label="Todos"
              icon={<Users className="h-3.5 w-3.5" />}
            />
            {members.map((m) => (
              <FilterChip
                key={m.id}
                active={selected === m.id}
                onClick={() => setSelected(m.id)}
                label={m.name}
                color={m.avatarColor}
                initials={m.initials}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {byMember.map(({ member, spent, budget }) => {
              const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
              const over = pct > 100;
              return (
                <button
                  key={member.id}
                  onClick={() => setSelected(member.id)}
                  className={cn(
                    "text-left rounded-xl border p-3 transition-colors hover:bg-muted/40",
                    selected === member.id && "border-primary bg-primary/5",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback
                        style={{ backgroundColor: member.avatarColor, color: "white" }}
                        className="text-[11px]"
                      >
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{member.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatCurrency(spent)} / {formatCurrency(budget)}
                      </p>
                    </div>
                    {over && (
                      <Badge variant="warning" className="text-[10px]">Excedido</Badge>
                    )}
                  </div>
                  <Progress
                    value={Math.min(100, pct)}
                    className="mt-2"
                    indicatorClassName={cn(
                      over
                        ? "bg-[hsl(var(--danger))]"
                        : pct > 80
                        ? "bg-[hsl(var(--warning))]"
                        : "bg-primary",
                    )}
                  />
                  <p className="mt-1 text-[10px] text-muted-foreground tabular-nums">
                    {pct}% del presupuesto
                  </p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>
            {selected === "todos"
              ? "Movimientos personales"
              : `Movimientos de ${members.find((m) => m.id === selected)?.name}`}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Total filtrado: <span className="font-medium text-foreground">{formatCurrency(total)}</span>
          </p>
        </CardHeader>
        <CardContent className="space-y-1">
          {list.length === 0 && (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Sin gastos personales para este filtro.
            </p>
          )}
          {list.map((t) => {
            const member = members.find((m) => m.id === t.memberId);
            return (
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
                    {member && (
                      <Badge variant="outline" className="text-[10px]">{member.name}</Badge>
                    )}
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
            );
          })}
        </CardContent>
      </Card>

      <Card className="bg-accent/40 border-dashed">
        <CardContent className="p-4 flex gap-3">
          <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Los gastos personales no afectan el presupuesto del hogar. Pueden ocultarse
            del resto del hogar desde Configuración → Privacidad.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  icon,
  color,
  initials,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  initials?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card hover:bg-muted",
      )}
    >
      {color && initials ? (
        <span
          className="h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-semibold text-white"
          style={{ backgroundColor: color }}
        >
          {initials}
        </span>
      ) : (
        icon
      )}
      {label}
    </button>
  );
}
