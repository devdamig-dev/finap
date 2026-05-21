import { PageHeader } from "@/components/app/page-header";
import { AIChatMock } from "@/components/ai/ai-chat-mock";
import { AIRecommendationCard } from "@/components/dashboard/ai-recommendation-card";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { generateRecommendations } from "@/lib/ai/recommendations";

export default function IAPage() {
  const recs = generateRecommendations();
  const featured = recs[0];
  const otros = recs.slice(1);

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="IA del hogar"
        description="Recomendaciones automáticas en base a tus datos y un chat para preguntarle a tu hogar."
      />

      <Card className="bg-gradient-to-br from-primary/5 to-accent border-primary/20">
        <CardContent className="p-5 flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Centro de inteligencia
            </p>
            <p className="text-sm mt-1">
              Tu copiloto analiza ingresos, gastos, vencimientos y tareas para sugerirte mejoras
              concretas. Cuanto más cargues, mejores recomendaciones.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-sm font-semibold tracking-tight mb-3">Recomendaciones automáticas</h2>
            <div className="space-y-3">
              {featured && <AIRecommendationCard recommendation={featured} featured />}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {otros.map((r) => (
                  <AIRecommendationCard key={r.id} recommendation={r} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div>
          <AIChatMock />
        </div>
      </div>
    </div>
  );
}
