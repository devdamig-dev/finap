import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { members, personalBudgets } from "@/lib/mock/members";
import { getPersonalSpentByMember } from "@/lib/mock/personal-expenses";
import { cn, formatCurrency } from "@/lib/utils";

export function PersonalExpensesMini() {
  const list = members.map((m) => {
    const spent = getPersonalSpentByMember(m.id);
    const budget = personalBudgets.find((p) => p.memberId === m.id)?.monthlyBudget ?? m.personalBudget ?? 0;
    return { member: m, spent, budget };
  });
  const total = list.reduce((acc, x) => acc + x.spent, 0);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Gastos personales
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Total del mes: <span className="font-medium text-foreground">{formatCurrency(total)}</span>
          </p>
        </div>
        <Link
          href="/dashboard/finanzas"
          className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline"
        >
          Ver detalle <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {list.map(({ member, spent, budget }) => {
          const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
          const over = pct > 100;
          return (
            <div key={member.id} className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback
                  style={{ backgroundColor: member.avatarColor, color: "white" }}
                  className="text-[11px]"
                >
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium">{member.name}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {formatCurrency(spent)} / {formatCurrency(budget)}
                  </span>
                </div>
                <Progress
                  value={Math.min(100, pct)}
                  indicatorClassName={cn(
                    over
                      ? "bg-[hsl(var(--danger))]"
                      : pct > 80
                      ? "bg-[hsl(var(--warning))]"
                      : "bg-primary",
                  )}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
