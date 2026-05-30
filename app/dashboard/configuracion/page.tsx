"use client";

import {
  Bell,
  Crown,
  Download,
  Home as HomeIcon,
  Landmark,
  Lock,
  RotateCcw,
  ShieldCheck,
  Tags,
  Users,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/feedback/toast-provider";
import { useActions } from "@/components/forms/action-context";
import { useAccounts, useAppStore, usePrivacy } from "@/lib/store/app-store";
import { household } from "@/lib/mock/household";
import { householdFinancialProfile, personalBudgets } from "@/lib/mock/members";
import type { FinancialProfile } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const categorias = [
  "Supermercado",
  "Delivery",
  "Transporte",
  "Salud",
  "Educación",
  "Servicios",
  "Entretenimiento",
  "Suscripciones",
];

const categoriasPersonales = [
  "Peluquería",
  "Gimnasio",
  "Deportes",
  "Ropa",
  "Salidas",
  "Cafetería",
  "Apps personales",
  "Cursos",
  "Hobbies",
];

const profileLabels: Record<FinancialProfile, string> = {
  conservador: "Conservador",
  equilibrado: "Equilibrado",
  agresivo: "Agresivo",
};

const profileDescriptions: Record<FinancialProfile, string> = {
  conservador: "Priorizo proteger el dinero antes que hacerlo rendir.",
  equilibrado: "Busco un punto medio entre seguridad y crecimiento.",
  agresivo: "Acepto más volatilidad a cambio de potencial de crecimiento.",
};

export default function ConfiguracionPage() {
  const { open } = useActions();
  const accounts = useAccounts();
  const privacy = usePrivacy();
  const { setPrivacy, reset } = useAppStore();
  const toast = useToast();
  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Configuración"
        description="Datos del hogar, integrantes, cuentas y preferencias del producto."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HomeIcon className="h-4 w-4" /> Datos del hogar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Row label="Nombre del hogar" value={household.name} />
          <Row label="Moneda principal" value="Pesos argentinos (ARS)" actionLabel="Cambiar" />
          <Row label="Zona horaria" value="America/Argentina/Buenos_Aires" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Integrantes y presupuestos personales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {household.members.map((m) => {
            const budget = personalBudgets.find((p) => p.memberId === m.id)?.monthlyBudget ?? m.personalBudget ?? 0;
            return (
              <div key={m.id} className="flex items-center gap-3 rounded-xl border p-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback style={{ backgroundColor: m.avatarColor, color: "white" }}>
                    {m.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{m.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.role} · Presupuesto personal: {formatCurrency(budget)}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">Editar</Button>
              </div>
            );
          })}
          <Button variant="soft" size="sm" className="w-full">
            Invitar a alguien al hogar
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Landmark className="h-4 w-4" /> Cuentas del hogar
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Bolsillos donde el hogar guarda y mueve el dinero.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {accounts.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-3 rounded-xl border p-3">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{a.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {a.kind.replace("-", " ")}
                  {a.isSaving && " · Marcada como ahorro"}
                </p>
              </div>
              <p className="text-sm font-semibold tabular-nums">{formatCurrency(a.balance)}</p>
            </div>
          ))}
          <Button variant="soft" size="sm" className="w-full" onClick={() => open("account")}>
            Agregar cuenta o bolsillo
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tags className="h-4 w-4" /> Categorías
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Categorías del hogar</p>
            <div className="flex flex-wrap gap-2">
              {categorias.map((c) => (
                <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
              ))}
              <Badge
                variant="outline"
                className="text-xs cursor-pointer hover:bg-muted"
                onClick={() => toast.info("Próximamente", "Vas a poder crear categorías propias.")}
              >
                + Nueva
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Categorías personales</p>
            <div className="flex flex-wrap gap-2">
              {categoriasPersonales.map((c) => (
                <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
              ))}
              <Badge
                variant="outline"
                className="text-xs cursor-pointer hover:bg-muted"
                onClick={() => toast.info("Próximamente", "Vas a poder crear categorías propias.")}
              >
                + Nueva
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Perfil financiero
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Sólo es una preferencia de organización. No es asesoramiento financiero.
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(Object.keys(profileLabels) as FinancialProfile[]).map((p) => (
            <div
              key={p}
              className={`rounded-xl border p-3 ${
                p === householdFinancialProfile ? "border-primary bg-primary/5" : "bg-card"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{profileLabels[p]}</p>
                {p === householdFinancialProfile && (
                  <Badge variant="default" className="text-[10px]">Actual</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{profileDescriptions[p]}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <ToggleRow label="Avisos de vencimientos próximos" defaultChecked />
          <Separator />
          <ToggleRow label="Resumen semanal por email" defaultChecked />
          <Separator />
          <ToggleRow label="Alertas de presupuesto excedido" defaultChecked />
          <Separator />
          <ToggleRow label="Sugerencias de la IA" defaultChecked />
          <Separator />
          <ToggleRow label="Avisos de presupuesto personal excedido" defaultChecked />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Privacidad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <ToggleRow
            label="Gastos personales visibles para todo el hogar"
            checked={privacy.personalDetailsVisible}
            onCheckedChange={(v) => {
              setPrivacy({ personalDetailsVisible: v });
              toast.info(v ? "Detalle personal visible" : "Detalle personal privado");
            }}
            hint="Si lo desactivás, en Finanzas y Dashboard sólo se ven totales agregados. Cada integrante siempre ve su detalle en Mis gastos."
          />
          <Separator />
          <ToggleRow
            label="Compartir totales agregados con todos los integrantes"
            checked={privacy.shareAggregates}
            onCheckedChange={(v) => {
              setPrivacy({ shareAggregates: v });
              toast.info(v ? "Totales por integrante visibles" : "Sólo total general");
            }}
            hint="Si lo desactivás, se muestra sólo el total general del hogar, sin desglose por integrante."
          />
          <Separator />
          <ToggleRow label="Permitir análisis anónimo para mejorar la IA" defaultChecked />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Exportar datos
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">Exportar CSV</Button>
          <Button variant="outline" size="sm">Exportar PDF mensual</Button>
          <Button variant="outline" size="sm">Exportar patrimonio</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" /> Resetear demo
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Borra todo lo que cargaste en esta sesión y vuelve a los datos seed.
            Sólo afecta tu navegador.
          </p>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              reset();
              toast.success("Demo reseteado", "Volvemos a los datos iniciales.");
            }}
          >
            Borrar mis cambios locales
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/5 to-accent border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-primary" /> Plan actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="success">Gratis</Badge>
              <span className="text-sm text-muted-foreground">
                Hasta 3 integrantes y recomendaciones básicas.
              </span>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <PlanCard
                name="Plus"
                price="$3.990 / mes"
                features={["IA real con OpenAI", "Notificaciones por WhatsApp", "Exportes ilimitados"]}
              />
              <PlanCard
                name="Familiar"
                price="$6.990 / mes"
                features={["Hasta 8 integrantes", "Múltiples hogares", "Soporte prioritario"]}
                highlight
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value, actionLabel }: { label: string; value: string; actionLabel?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
      {actionLabel && (
        <Button variant="ghost" size="sm" className="text-xs">{actionLabel}</Button>
      )}
    </div>
  );
}

function ToggleRow({
  label,
  defaultChecked,
  checked,
  onCheckedChange,
  hint,
}: {
  label: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <div className="flex-1">
        <p className="text-sm">{label}</p>
        {hint && <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      {checked !== undefined ? (
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
      ) : (
        <Switch defaultChecked={defaultChecked} />
      )}
    </div>
  );
}

function PlanCard({
  name,
  price,
  features,
  highlight,
}: {
  name: string;
  price: string;
  features: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${highlight ? "border-primary bg-primary/5" : "bg-card"}`}
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold">{name}</p>
        {highlight && <Badge variant="default">Recomendado</Badge>}
      </div>
      <p className="text-sm text-muted-foreground mt-1">{price}</p>
      <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
        {features.map((f) => (
          <li key={f}>· {f}</li>
        ))}
      </ul>
      <Button size="sm" className="w-full mt-3" variant={highlight ? "default" : "outline"}>
        <Wallet className="h-3.5 w-3.5" /> Mejorar plan
      </Button>
    </div>
  );
}
