import { AccountsList } from "@/components/finance/accounts-list";
import { InvestmentsList } from "@/components/finance/investments-list";
import { NetWorthCard } from "@/components/finance/net-worth-card";
import { SavingDistribution } from "@/components/finance/saving-distribution";
import { SavingsOverview } from "@/components/finance/savings-overview";
import { AIRecommendationCard } from "@/components/dashboard/ai-recommendation-card";
import { generateRecommendationsByGroup } from "@/lib/ai/recommendations";

export function SavingsInvestmentsSection() {
  const groups = generateRecommendationsByGroup();
  const recs = [...groups.ahorro, ...groups.inversiones].slice(0, 3);

  return (
    <div className="space-y-4">
      <SavingsOverview />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <NetWorthCard />
        <SavingDistribution />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AccountsList />
        <InvestmentsList />
      </div>

      {recs.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold tracking-tight px-1">
            Recomendaciones sobre ahorro e inversiones
          </p>
          {recs.map((r) => (
            <AIRecommendationCard key={r.id} recommendation={r} />
          ))}
        </div>
      )}
    </div>
  );
}
