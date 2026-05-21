import { AIRecommendationCard } from "@/components/dashboard/ai-recommendation-card";
import { DashboardSummary } from "@/components/dashboard/dashboard-summary";
import { ExpenseCategoryChart } from "@/components/dashboard/expense-category-chart";
import { FinancialHealthCard } from "@/components/dashboard/financial-health-card";
import { GoalsOverview } from "@/components/dashboard/goals-overview";
import { HouseholdTasksList } from "@/components/dashboard/household-tasks-list";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { UpcomingBillsList } from "@/components/dashboard/upcoming-bills-list";
import { generateRecommendations } from "@/lib/ai/recommendations";
import { household } from "@/lib/mock/household";

export default function DashboardPage() {
  const recommendations = generateRecommendations();
  const featured =
    recommendations.find((r) => r.level === "atencion" || r.level === "alerta") ?? recommendations[0];
  const otherRecs = recommendations.filter((r) => r.id !== featured?.id).slice(0, 3);
  const firstName = household.members[0].name.split(" ")[0];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <p className="text-xs text-muted-foreground">Buenas, {firstName} 👋</p>
        <h1 className="text-xl lg:text-2xl font-semibold tracking-tight">Tu hogar de un vistazo</h1>
      </div>

      <DashboardSummary />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <FinancialHealthCard />
          {featured && <AIRecommendationCard recommendation={featured} featured />}
          <ExpenseCategoryChart />
        </div>
        <div className="space-y-4">
          <UpcomingBillsList limit={4} />
          <GoalsOverview limit={2} />
        </div>
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HouseholdTasksList limit={5} />
        <div className="space-y-3">
          <p className="text-sm font-semibold tracking-tight px-1">Más recomendaciones</p>
          {otherRecs.map((r) => (
            <AIRecommendationCard key={r.id} recommendation={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
