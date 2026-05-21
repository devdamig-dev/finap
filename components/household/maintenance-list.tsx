import { Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { maintenanceItems } from "@/lib/mock/maintenance";
import { cn, daysUntil, formatDate } from "@/lib/utils";

const tone = {
  ok: { variant: "success" as const, label: "Al día" },
  proximo: { variant: "warning" as const, label: "Próximo" },
  atrasado: { variant: "danger" as const, label: "Atrasado" },
};

export function MaintenanceList() {
  const sorted = [...maintenanceItems].sort(
    (a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime(),
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-4 w-4" /> Mantenimiento del hogar
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          Servicios y revisiones recurrentes
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {sorted.map((m) => {
          const days = daysUntil(m.nextDue);
          const t = tone[m.status];
          return (
            <div key={m.id} className="flex items-start gap-3 rounded-xl border p-3">
              <div
                className={cn(
                  "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                  m.status === "atrasado"
                    ? "bg-danger-soft text-[hsl(var(--danger))]"
                    : m.status === "proximo"
                    ? "bg-warning-soft text-[hsl(var(--warning-foreground))]"
                    : "bg-success-soft text-[hsl(var(--success))]",
                )}
              >
                <Wrench className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.asset}</p>
                  </div>
                  <Badge variant={t.variant} className="text-[10px] shrink-0">
                    {t.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>
                    {days < 0
                      ? `Vencido hace ${Math.abs(days)} días`
                      : days === 0
                      ? "Vence hoy"
                      : `En ${days} días — ${formatDate(m.nextDue)}`}
                  </span>
                  {m.responsible && <span>· {m.responsible}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
