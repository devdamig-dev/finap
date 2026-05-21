import {
  Bell,
  Crown,
  Download,
  Home as HomeIcon,
  Lock,
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
import { household } from "@/lib/mock/household";

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

export default function ConfiguracionPage() {
  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Configuración"
        description="Datos del hogar, integrantes y preferencias del producto."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HomeIcon className="h-4 w-4" /> Datos del hogar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Row label="Nombre del hogar" value={household.name} />
          <Row label="Moneda" value="Pesos argentinos (ARS)" actionLabel="Cambiar" />
          <Row label="Zona horaria" value="America/Argentina/Buenos_Aires" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Integrantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {household.members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 rounded-xl border p-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback style={{ backgroundColor: m.avatarColor, color: "white" }}>
                  {m.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">Editar</Button>
            </div>
          ))}
          <Button variant="soft" size="sm" className="w-full">
            Invitar a alguien al hogar
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tags className="h-4 w-4" /> Categorías
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categorias.map((c) => (
              <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
            ))}
            <Badge variant="outline" className="text-xs cursor-pointer">+ Nueva</Badge>
          </div>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Privacidad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <ToggleRow label="Permitir análisis anónimo para mejorar la IA" defaultChecked />
          <Separator />
          <ToggleRow label="Compartir datos con integrantes del hogar" defaultChecked />
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

function ToggleRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="text-sm">{label}</span>
      <Switch defaultChecked={defaultChecked} />
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
