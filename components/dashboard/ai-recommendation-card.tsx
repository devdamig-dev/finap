import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AIRecommendation } from "@/lib/types";
import { cn } from "@/lib/utils";

const levelStyles: Record<string, { bg: string; text: string; dot: string }> = {
  positivo: {
    bg: "bg-success-soft",
    text: "text-[hsl(var(--success))]",
    dot: "bg-[hsl(var(--success))]",
  },
  info: {
    bg: "bg-accent",
    text: "text-accent-foreground",
    dot: "bg-primary",
  },
  atencion: {
    bg: "bg-warning-soft",
    text: "text-[hsl(var(--warning-foreground))]",
    dot: "bg-[hsl(var(--warning))]",
  },
  alerta: {
    bg: "bg-danger-soft",
    text: "text-[hsl(var(--danger))]",
    dot: "bg-[hsl(var(--danger))]",
  },
};

export function AIRecommendationCard({
  recommendation,
  featured,
}: {
  recommendation: AIRecommendation;
  featured?: boolean;
}) {
  const style = levelStyles[recommendation.level];

  if (featured) {
    return (
      <Card className="bg-gradient-to-br from-primary to-brand-700 text-primary-foreground border-none overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 text-xs font-medium opacity-90">
            <Sparkles className="h-4 w-4" /> Recomendación del día
          </div>
          <h3 className="text-lg font-semibold mt-2">{recommendation.title}</h3>
          <p className="text-sm opacity-90 mt-1 whitespace-pre-line">{recommendation.description}</p>
          {recommendation.actionHref && recommendation.actionLabel && (
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="mt-4 bg-white text-primary hover:bg-white/90"
            >
              <Link href={recommendation.actionHref}>
                {recommendation.actionLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex gap-3">
        <div className={cn("h-9 w-9 shrink-0 rounded-lg flex items-center justify-center", style.bg)}>
          <Sparkles className={cn("h-4 w-4", style.text)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{recommendation.title}</p>
          <p className="text-sm text-muted-foreground mt-0.5 whitespace-pre-line">
            {recommendation.description}
          </p>
          {recommendation.actionHref && recommendation.actionLabel && (
            <Link
              href={recommendation.actionHref}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-2 hover:underline"
            >
              {recommendation.actionLabel}
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
