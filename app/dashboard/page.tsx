import { AIRecommendationCard } from "@/components/dashboard/ai-recommendation-card";
import { DashboardSummary } from "@/components/dashboard/dashboard-summary";
import { ExpenseCategoryChart } from "@/components/dashboard/expense-category-chart";
import { FinancialHealthCard } from "@/components/dashboard/financial-health-card";
import { GoalsOverview } from "@/components/dashboard/goals-overview";
import { HouseholdTasksList } from "@/components/dashboard/household-tasks-list";
import { PersonalAggregatedCard } from "@/components/finance/personal-aggregated-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { SavingsMini } from "@/components/dashboard/savings-mini";
import { UpcomingBillsList } from "@/components/dashboard/upcoming-bills-list";
import { UpcomingPurchasesMini } from "@/components/dashboard/upcoming-purchases-mini";
import { NetWorthCard } from "@/components/finance/net-worth-card";
import { generateRecommendations } from "@/lib/ai/recommendations";
import { household } from "@/lib/mock/household";

export default function DashboardPage() {
  const recommendations = generateRecommendations();
  const featured =
    recommendations.find((r) => r.level === "atencion" || r.level === "alerta") ?? recommendations[0];
  const savingRec = recommendations.find(
    (r) => r.group === "ahorro" || r.group === "inversiones",
  );
  const otherRecs = recommendations
    .filter((r) => r.id !== featured?.id && r.id !== savingRec?.id)
    .slice(0, 3);
  const firstName = household.members[0].name.split(" ")[0];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <p className="text-xs text-muted-foreground">Buenas, {firstName} 👋</p>
        <h1 className="text-xl lg:text-2xl font-semibold tracking-tight">Tu hogar de un vistazo</h1>
      </div>

      <DashboardSummary />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <SavingsMini />
        </div>
        <NetWorthCard compact />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <FinancialHealthCard />
          {featured && <AIRecommendationCard recommendation={featured} featured />}
          {savingRec && <AIRecommendationCard recommendation={savingRec} />}
          <ExpenseCategoryChart />
        </div>
        <div className="space-y-4">
          <UpcomingBillsList limit={4} />
          <GoalsOverview limit={2} />
          <PersonalAggregatedCard compact />
        </div>
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HouseholdTasksList limit={5} />
        <UpcomingPurchasesMini limit={4} />
      </div>

      <div>
        <p className="text-sm font-semibold tracking-tight px-1 mb-2">Más recomendaciones</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {otherRecs.map((r) => (
            <AIRecommendationCard key={r.id} recommendation={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
