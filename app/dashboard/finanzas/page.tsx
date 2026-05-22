import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/app/page-header";
import { BudgetOverview } from "@/components/finance/budget-overview";
import { CardsDebts } from "@/components/finance/cards-debts";
import { FinanceAlerts } from "@/components/finance/finance-alerts";
import { PersonalExpenses } from "@/components/finance/personal-expenses";
import { SavingsInvestmentsSection } from "@/components/finance/savings-investments-section";
import { TransactionsList } from "@/components/finance/transactions-list";
import { DashboardSummary } from "@/components/dashboard/dashboard-summary";
import { ExpenseCategoryChart } from "@/components/dashboard/expense-category-chart";
import { GoalsOverview } from "@/components/dashboard/goals-overview";
import { NetWorthCard } from "@/components/finance/net-worth-card";
import { householdTransactions, transactions } from "@/lib/mock/transactions";

export default function FinanzasPage() {
  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Finanzas"
        description="Movimientos, presupuestos, ahorro, deudas y objetivos. Todo el dinero del hogar en un solo lugar."
        action={
          <Button size="sm" className="hidden sm:flex">
            <Plus className="h-4 w-4" /> Nuevo movimiento
          </Button>
        }
      />

      <DashboardSummary />

      <FinanceAlerts />

      <Tabs defaultValue="movimientos">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="presupuesto">Presupuesto</TabsTrigger>
          <TabsTrigger value="ahorro">Ahorro e inversiones</TabsTrigger>
          <TabsTrigger value="tarjetas">Tarjetas y deudas</TabsTrigger>
          <TabsTrigger value="personales">Gastos personales</TabsTrigger>
          <TabsTrigger value="objetivos">Objetivos</TabsTrigger>
        </TabsList>

        {/* Movimientos */}
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
                description="Últimos movimientos del mes (hogar + personales)"
                transactions={transactions}
                limit={20}
              />
            </TabsContent>
            <TabsContent value="ingresos">
              <TransactionsList
                title="Ingresos"
                description="Sueldos, freelances y otros"
                transactions={transactions.filter((t) => t.type === "ingreso")}
              />
            </TabsContent>
            <TabsContent value="gastos">
              <TransactionsList
                title="Gastos"
                description="Todo lo que salió del hogar este mes"
                transactions={transactions.filter((t) => t.type === "gasto")}
              />
            </TabsContent>
            <TabsContent value="fijos">
              <TransactionsList
                title="Gastos fijos"
                description="Alquiler, servicios, salud, educación"
                transactions={householdTransactions.filter(
                  (t) => t.type === "gasto" && t.kind === "fijo",
                )}
              />
            </TabsContent>
            <TabsContent value="variables">
              <TransactionsList
                title="Gastos variables"
                description="Compras, delivery, salidas, etc."
                transactions={householdTransactions.filter(
                  (t) => t.type === "gasto" && t.kind === "variable",
                )}
              />
            </TabsContent>
            <TabsContent value="ahorro-inv">
              <TransactionsList
                title="Ahorro e inversiones"
                description="Aportes a objetivos, suscripciones a fondos, plazo fijo"
                transactions={transactions.filter(
                  (t) => t.type === "ahorro" || t.type === "inversion",
                )}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Presupuesto */}
        <TabsContent value="presupuesto" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BudgetOverview />
            <ExpenseCategoryChart />
          </div>
        </TabsContent>

        {/* Ahorro e inversiones */}
        <TabsContent value="ahorro">
          <SavingsInvestmentsSection />
        </TabsContent>

        {/* Tarjetas y deudas */}
        <TabsContent value="tarjetas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CardsDebts />
            <NetWorthCard />
          </div>
        </TabsContent>

        {/* Gastos personales */}
        <TabsContent value="personales">
          <PersonalExpenses />
        </TabsContent>

        {/* Objetivos */}
        <TabsContent value="objetivos" className="space-y-4">
          <GoalsOverview limit={10} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
