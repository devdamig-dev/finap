"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/app/page-header";
import { BudgetOverview } from "@/components/finance/budget-overview";
import { CardsDebts } from "@/components/finance/cards-debts";
import { FinanceAlerts } from "@/components/finance/finance-alerts";
import { PersonalAggregatedCard } from "@/components/finance/personal-aggregated-card";
import { SavingsInvestmentsSection } from "@/components/finance/savings-investments-section";
import { TransactionsList } from "@/components/finance/transactions-list";
import { DashboardSummary } from "@/components/dashboard/dashboard-summary";
import { ExpenseCategoryChart } from "@/components/dashboard/expense-category-chart";
import { GoalsOverview } from "@/components/dashboard/goals-overview";
import { NetWorthCard } from "@/components/finance/net-worth-card";
import { useActions } from "@/components/forms/action-context";
import { useTransactions } from "@/lib/store/app-store";

export default function FinanzasPage() {
  const { open } = useActions();
  const all = useTransactions();

  // Finanzas trabaja sólo con movimientos del hogar y compartidos.
  // Los gastos personales individuales NO aparecen en la lista principal.
  const household = all.filter((t) => t.scope !== "personal");

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Finanzas"
        description="Movimientos del hogar, presupuesto, ahorro, deudas y objetivos."
        action={
          <Button size="sm" className="hidden sm:flex" onClick={() => open("transaction")}>
            <Plus className="h-4 w-4" /> Nuevo movimiento
          </Button>
        }
      />

      <DashboardSummary />

      <FinanceAlerts />

      <PersonalAggregatedCard />

      <Tabs defaultValue="movimientos">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="presupuesto">Presupuesto</TabsTrigger>
          <TabsTrigger value="ahorro">Ahorro e inversiones</TabsTrigger>
          <TabsTrigger value="tarjetas">Tarjetas y deudas</TabsTrigger>
          <TabsTrigger value="objetivos">Objetivos</TabsTrigger>
        </TabsList>

        <TabsContent value="movimientos">
          <Tabs defaultValue="todos">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
              <TabsTrigger value="gastos">Gastos</TabsTrigger>
              <TabsTrigger value="fijos">Fijos</TabsTrigger>
              <TabsTrigger value="variables">Variables</TabsTrigger>
              <TabsTrigger value="ahorro-inv">Ahorro / inversión</TabsTrigger>
            </TabsList>
            <TabsContent value="todos">
              <TransactionsList
                description="Movimientos del hogar y compartidos. Los gastos personales viven en Mis gastos."
                transactions={household}
                limit={25}
              />
            </TabsContent>
            <TabsContent value="ingresos">
              <TransactionsList
                title="Ingresos del hogar"
                description="Sueldos, freelances y otros"
                transactions={household.filter((t) => t.type === "ingreso")}
              />
            </TabsContent>
            <TabsContent value="gastos">
              <TransactionsList
                title="Gastos del hogar"
                description="Todo lo que salió del hogar este mes"
                transactions={household.filter((t) => t.type === "gasto")}
              />
            </TabsContent>
            <TabsContent value="fijos">
              <TransactionsList
                title="Gastos fijos"
                description="Alquiler, servicios, salud, educación"
                transactions={household.filter((t) => t.type === "gasto" && t.kind === "fijo")}
              />
            </TabsContent>
            <TabsContent value="variables">
              <TransactionsList
                title="Gastos variables"
                description="Compras, delivery, salidas compartidas, etc."
                transactions={household.filter((t) => t.type === "gasto" && t.kind === "variable")}
              />
            </TabsContent>
            <TabsContent value="ahorro-inv">
              <TransactionsList
                title="Ahorro e inversiones"
                description="Aportes a objetivos, suscripciones a fondos, plazo fijo"
                transactions={household.filter(
                  (t) => t.type === "ahorro" || t.type === "inversion",
                )}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="presupuesto" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BudgetOverview />
            <ExpenseCategoryChart />
          </div>
        </TabsContent>

        <TabsContent value="ahorro">
          <SavingsInvestmentsSection />
        </TabsContent>

        <TabsContent value="tarjetas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CardsDebts />
            <NetWorthCard />
          </div>
        </TabsContent>

        <TabsContent value="objetivos" className="space-y-4">
          <GoalsOverview limit={10} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
