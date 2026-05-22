"use client";

import { Plus, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { MyCategoriesDistribution } from "@/components/personal/my-categories-distribution";
import { MyExpensesSummary } from "@/components/personal/my-expenses-summary";
import { MyRecommendations } from "@/components/personal/my-recommendations";
import { MyRecurring } from "@/components/personal/my-recurring";
import { MyTransactions } from "@/components/personal/my-transactions";
import { useActions } from "@/components/forms/action-context";
import { CURRENT_MEMBER_NAME } from "@/lib/store/current-user";

export default function MisGastosPage() {
  const { open } = useActions();

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Mis gastos"
        description={`Sólo lo tuyo, ${CURRENT_MEMBER_NAME}. Tus gastos personales no afectan el presupuesto del hogar.`}
        action={
          <div className="hidden sm:flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => open("income", { scope: "personal" })}
            >
              <TrendingUp className="h-4 w-4" /> Ingreso personal
            </Button>
            <Button size="sm" onClick={() => open("personal-expense")}>
              <Plus className="h-4 w-4" /> Agregar gasto personal
            </Button>
          </div>
        }
      />

      <MyExpensesSummary />

      <div className="sm:hidden">
        <Button className="w-full" onClick={() => open("personal-expense")}>
          <Plus className="h-4 w-4" /> Agregar gasto personal
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MyCategoriesDistribution />
        <MyRecurring />
      </div>

      <MyTransactions />

      <MyRecommendations />
    </div>
  );
}
