import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/app/page-header";
import { BudgetOverview } from "@/components/finance/budget-overview";
import { CardsDebts } from "@/components/finance/cards-debts";
import { FinanceAlerts } from "@/components/finance/finance-alerts";
import { TransactionsList } from "@/components/finance/transactions-list";
import { DashboardSummary } from "@/components/dashboard/dashboard-summary";
import { ExpenseCategoryChart } from "@/components/dashboard/expense-category-chart";
import { GoalsOverview } from "@/components/dashboard/goals-overview";
import { Plus } from "lucide-react";
import { transactions } from "@/lib/mock/transactions";

export default function FinanzasPage() {
  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Finanzas"
        description="Movimientos, presupuestos, deudas y objetivos. Todo el dinero del hogar en un solo lugar."
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
          <TabsTrigger value="movimientos">Todos</TabsTrigger>
          <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
          <TabsTrigger value="gastos">Gastos</TabsTrigger>
          <TabsTrigger value="fijos">Gastos fijos</TabsTrigger>
          <TabsTrigger value="variables">Gastos variables</TabsTrigger>
        </TabsList>
        <TabsContent value="movimientos">
          <TransactionsList
            description="Últimos movimientos del mes"
            transactions={transactions}
            limit={15}
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
            transactions={transactions.filter((t) => t.type === "gasto" && t.kind === "fijo")}
          />
        </TabsContent>
        <TabsContent value="variables">
          <TransactionsList
            title="Gastos variables"
            description="Compras, delivery, salidas, etc."
            transactions={transactions.filter((t) => t.type === "gasto" && t.kind === "variable")}
          />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BudgetOverview />
        <ExpenseCategoryChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CardsDebts />
        <GoalsOverview limit={4} />
      </div>
    </div>
  );
}
