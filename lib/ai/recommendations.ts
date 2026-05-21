import { bills as defaultBills } from "@/lib/mock/bills";
import { goals as defaultGoals } from "@/lib/mock/goals";
import { maintenanceItems as defaultMaintenance } from "@/lib/mock/maintenance";
import { tasks as defaultTasks } from "@/lib/mock/tasks";
import {
  subscriptions as defaultSubscriptions,
  transactions as defaultTransactions,
} from "@/lib/mock/transactions";
import type {
  AIRecommendation,
  Bill,
  Goal,
  HouseholdTask,
  MaintenanceItem,
  Subscription,
  Transaction,
} from "@/lib/types";
import { daysUntil, formatCurrency, percentage } from "@/lib/utils";

export interface RecommendationInput {
  transactions?: Transaction[];
  bills?: Bill[];
  tasks?: HouseholdTask[];
  goals?: Goal[];
  subscriptions?: Subscription[];
  maintenance?: MaintenanceItem[];
}

function sum(list: Transaction[]) {
  return list.reduce((acc, t) => acc + t.amount, 0);
}

export function getMonthlySummary(transactions: Transaction[]) {
  const incomes = transactions.filter((t) => t.type === "ingreso");
  const expenses = transactions.filter((t) => t.type === "gasto");
  const fixed = expenses.filter((t) => t.kind === "fijo");
  const variable = expenses.filter((t) => t.kind === "variable");

  const totalIncome = sum(incomes);
  const totalExpense = sum(expenses);
  const totalFixed = sum(fixed);
  const totalVariable = sum(variable);

  return {
    totalIncome,
    totalExpense,
    totalFixed,
    totalVariable,
    balance: totalIncome - totalExpense,
    savingRate: totalIncome > 0 ? (totalIncome - totalExpense) / totalIncome : 0,
    fixedShare: totalIncome > 0 ? totalFixed / totalIncome : 0,
  };
}

export function getExpenseByCategory(transactions: Transaction[]) {
  const map = new Map<string, number>();
  transactions
    .filter((t) => t.type === "gasto")
    .forEach((t) => {
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
    });
  return Array.from(map.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Motor local simulado de recomendaciones de IA.
 * Analiza los datos del hogar y emite insights útiles y accionables.
 */
export function generateRecommendations(
  input: RecommendationInput = {},
): AIRecommendation[] {
  const transactions = input.transactions ?? defaultTransactions;
  const bills = input.bills ?? defaultBills;
  const tasks = input.tasks ?? defaultTasks;
  const goals = input.goals ?? defaultGoals;
  const subscriptions = input.subscriptions ?? defaultSubscriptions;
  const maintenance = input.maintenance ?? defaultMaintenance;

  const recs: AIRecommendation[] = [];
  const summary = getMonthlySummary(transactions);
  const byCategory = getExpenseByCategory(transactions);

  // 1. Saldo ajustado
  if (summary.totalExpense > summary.totalIncome * 0.85) {
    const restante = summary.totalIncome - summary.totalExpense;
    recs.push({
      id: "rec-saldo-ajustado",
      level: restante < 0 ? "alerta" : "atencion",
      module: "finanzas",
      title: restante < 0 ? "El mes cierra en rojo" : "El mes viene ajustado",
      description:
        restante < 0
          ? `Estás gastando ${formatCurrency(Math.abs(restante))} más de lo que entra. Conviene revisar gastos variables esta semana.`
          : `Ya gastaste el ${percentage(summary.totalExpense, summary.totalIncome)}% de tus ingresos. Queda margen chico (${formatCurrency(restante)}) para imprevistos.`,
      actionLabel: "Ver finanzas",
      actionHref: "/dashboard/finanzas",
    });
  } else if (summary.savingRate > 0.2) {
    recs.push({
      id: "rec-ahorro-bueno",
      level: "positivo",
      module: "finanzas",
      title: "Buen ritmo de ahorro",
      description: `Vas ahorrando ${formatCurrency(summary.balance)} este mes (${Math.round(summary.savingRate * 100)}% de tus ingresos). Si querés, podés sumar ese excedente a un objetivo.`,
      actionLabel: "Ver objetivos",
      actionHref: "/dashboard/finanzas",
    });
  }

  // 2. Gastos fijos altos
  if (summary.fixedShare > 0.55) {
    recs.push({
      id: "rec-fijos-altos",
      level: "atencion",
      module: "finanzas",
      title: `Tus gastos fijos son el ${Math.round(summary.fixedShare * 100)}% de tus ingresos`,
      description:
        "Cuando los fijos pasan el 55%, el hogar pierde flexibilidad ante imprevistos. Revisar seguros, planes de salud o servicios suele dar márgenes interesantes.",
      actionLabel: "Revisar gastos fijos",
      actionHref: "/dashboard/finanzas",
    });
  }

  // 3. Categoría con mucho peso
  const topCategory = byCategory[0];
  if (topCategory && summary.totalExpense > 0) {
    const share = topCategory.amount / summary.totalExpense;
    if (share > 0.25 && topCategory.category !== "Alquiler") {
      recs.push({
        id: `rec-cat-${topCategory.category}`,
        level: "atencion",
        module: "finanzas",
        title: `${topCategory.category} se llevó el ${Math.round(share * 100)}% del mes`,
        description: `Gastaste ${formatCurrency(topCategory.amount)} en ${topCategory.category}. Podés revisar si hay forma de bajarlo el mes que viene.`,
        actionLabel: "Ver detalle",
        actionHref: "/dashboard/finanzas",
      });
    }
  }

  // 4. Delivery subió
  const delivery = transactions.filter((t) => t.type === "gasto" && t.category === "Delivery");
  if (delivery.length >= 3) {
    const total = sum(delivery);
    recs.push({
      id: "rec-delivery",
      level: "atencion",
      module: "finanzas",
      title: `${delivery.length} pedidos de delivery este mes`,
      description: `Sumaste ${formatCurrency(total)} en delivery. Planificar una o dos cenas más por semana puede liberar bastante presupuesto.`,
      actionLabel: "Crear plan de compras",
      actionHref: "/dashboard/hogar",
    });
  }

  // 5. Vencimientos próximos
  const proximos = bills.filter((b) => {
    const d = daysUntil(b.dueDate);
    return b.status !== "pagado" && d >= 0 && d <= 5;
  });
  if (proximos.length > 0) {
    const total = proximos.reduce((acc, b) => acc + b.amount, 0);
    recs.push({
      id: "rec-vencimientos",
      level: "atencion",
      module: "calendario",
      title: `${proximos.length} vencimientos en los próximos días`,
      description: `Por ${formatCurrency(total)} en total. Buen momento para separar la plata o programar el débito.`,
      actionLabel: "Ver vencimientos",
      actionHref: "/dashboard/calendario",
    });
  }

  // 6. Vencidos
  const vencidos = bills.filter((b) => b.status === "vencido");
  if (vencidos.length > 0) {
    recs.push({
      id: "rec-vencidos",
      level: "alerta",
      module: "calendario",
      title: `${vencidos.length} ${vencidos.length === 1 ? "vencimiento vencido" : "vencimientos vencidos"}`,
      description: `Hay pagos atrasados por ${formatCurrency(vencidos.reduce((a, b) => a + b.amount, 0))}. Resolverlos hoy evita recargos.`,
      actionLabel: "Ir a pagar",
      actionHref: "/dashboard/calendario",
    });
  }

  // 7. Tareas vencidas
  const tareasVencidas = tasks.filter(
    (t) => t.status !== "completado" && t.dueDate && daysUntil(t.dueDate) < 0,
  );
  if (tareasVencidas.length > 0) {
    recs.push({
      id: "rec-tareas-vencidas",
      level: "atencion",
      module: "hogar",
      title: `${tareasVencidas.length} ${tareasVencidas.length === 1 ? "tarea atrasada" : "tareas atrasadas"} en el hogar`,
      description: tareasVencidas
        .slice(0, 2)
        .map((t) => `· ${t.title} (${t.responsible})`)
        .join("\n"),
      actionLabel: "Ver tareas",
      actionHref: "/dashboard/hogar",
    });
  }

  // 8. Objetivo atrasado
  const objetivoAtrasado = goals.find((g) => g.status === "atrasado");
  if (objetivoAtrasado) {
    const restante = objetivoAtrasado.target - objetivoAtrasado.saved;
    const semanasHasta = Math.max(
      4,
      Math.round((new Date(objetivoAtrasado.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 7)),
    );
    const aporteSemanal = Math.round(restante / semanasHasta);
    recs.push({
      id: `rec-goal-${objetivoAtrasado.id}`,
      level: "atencion",
      module: "finanzas",
      title: `"${objetivoAtrasado.title}" está atrasado`,
      description: `Si querés llegar a la meta, sumando ${formatCurrency(aporteSemanal)} por semana volvés al ritmo previsto.`,
      actionLabel: "Ajustar objetivo",
      actionHref: "/dashboard/finanzas",
    });
  }

  // 9. Suscripciones
  if (subscriptions.length >= 3) {
    const totalSubs = subscriptions.reduce((a, s) => a + s.amount, 0);
    recs.push({
      id: "rec-subs",
      level: "info",
      module: "finanzas",
      title: `Tenés ${subscriptions.length} suscripciones activas`,
      description: `Suman ${formatCurrency(totalSubs)} por mes. Revisar cuáles se usan menos puede liberar ${formatCurrency(Math.round(totalSubs * 0.3))} sin esfuerzo.`,
      actionLabel: "Revisar suscripciones",
      actionHref: "/dashboard/finanzas",
    });
  }

  // 10. Compras frecuentes — agrupar
  const comprasSuper = transactions.filter(
    (t) => t.type === "gasto" && t.category === "Supermercado",
  );
  if (comprasSuper.length >= 3) {
    recs.push({
      id: "rec-compras-super",
      level: "info",
      module: "hogar",
      title: "Hiciste varias compras chicas de supermercado",
      description: `${comprasSuper.length} visitas este mes. Agruparlas en una compra grande semanal suele ahorrar entre un 10 y 15%.`,
      actionLabel: "Armar lista",
      actionHref: "/dashboard/hogar",
    });
  }

  // 11. Mantenimientos atrasados
  const mantAtrasado = maintenance.filter((m) => m.status === "atrasado");
  if (mantAtrasado.length > 0) {
    recs.push({
      id: "rec-mant-atrasado",
      level: "alerta",
      module: "hogar",
      title: "Hay mantenimientos del hogar atrasados",
      description: mantAtrasado
        .slice(0, 2)
        .map((m) => `· ${m.title} — ${m.asset}`)
        .join("\n"),
      actionLabel: "Ver mantenimiento",
      actionHref: "/dashboard/hogar",
    });
  }

  return recs;
}

export function getHouseholdHealth(transactions: Transaction[]): {
  status: "estable" | "ajustado" | "alerta";
  label: string;
  description: string;
} {
  const { totalIncome, totalExpense, savingRate } = getMonthlySummary(transactions);
  if (totalExpense > totalIncome) {
    return {
      status: "alerta",
      label: "En alerta",
      description: "El mes viene cerrando en rojo. Conviene priorizar gastos esenciales.",
    };
  }
  if (savingRate < 0.1) {
    return {
      status: "ajustado",
      label: "Ajustado",
      description: "Queda poco margen. Cuidar los gastos variables ayuda a llegar mejor.",
    };
  }
  return {
    status: "estable",
    label: "Estable",
    description: "El hogar está equilibrado y con margen para imprevistos.",
  };
}

/**
 * Respuestas simuladas para el chat "Preguntale a tu hogar".
 * Más adelante esta función se reemplaza por una llamada al backend / OpenAI.
 */
export function answerHouseholdQuestion(question: string): string {
  const q = question.toLowerCase();
  const summary = getMonthlySummary(defaultTransactions);
  const byCategory = getExpenseByCategory(defaultTransactions);

  if (q.includes("fin de mes") || q.includes("llegamos") || q.includes("llegar")) {
    if (summary.balance < 0) {
      return `Por ahora el mes cierra negativo: gastaste ${formatCurrency(summary.totalExpense)} contra ${formatCurrency(summary.totalIncome)} de ingresos. Te recomiendo bajar delivery y posponer compras no urgentes.`;
    }
    if (summary.savingRate < 0.1) {
      return `Vas justo. Te queda un margen de ${formatCurrency(summary.balance)} para los próximos días. Si cuidás los variables, llegás bien.`;
    }
    return `Sí, llegan bien. Tienen un excedente proyectado de ${formatCurrency(summary.balance)}. Buen momento para reforzar el fondo de emergencia.`;
  }

  if (q.includes("ahorrar") || q.includes("ahorro")) {
    const top = byCategory[0];
    return `Si querés ahorrar, mirá ${top.category}: te llevó ${formatCurrency(top.amount)} este mes. Reducir un 20% ahí libera ${formatCurrency(Math.round(top.amount * 0.2))}. También conviene revisar las suscripciones activas.`;
  }

  if (q.includes("subieron") || q.includes("aumentaron") || q.includes("más caro")) {
    return `Las categorías más pesadas del mes son: ${byCategory
      .slice(0, 3)
      .map((c) => `${c.category} (${formatCurrency(c.amount)})`)
      .join(", ")}. Delivery está creciendo respecto al mes anterior.`;
  }

  if (q.includes("vencimiento") || q.includes("pagar")) {
    const proximos = defaultBills.filter((b) => b.status !== "pagado").slice(0, 4);
    return `Próximos vencimientos:\n${proximos
      .map((b) => `· ${b.title} — ${formatCurrency(b.amount)} (en ${daysUntil(b.dueDate)} días)`)
      .join("\n")}`;
  }

  if (q.includes("plan") || q.includes("armame") || q.includes("ahorr")) {
    return `Plan rápido para este mes:\n1. Dejá separados ${formatCurrency(Math.round(summary.totalIncome * 0.1))} apenas entra el sueldo.\n2. Limitá delivery a una vez por semana.\n3. Hacé una compra grande de supermercado en lugar de varias chicas.\n4. Pasá las suscripciones que no usan a una sola cuenta familiar.`;
  }

  if (q.includes("tarea") || q.includes("atras") || q.includes("hogar")) {
    const atrasadas = defaultTasks.filter(
      (t) => t.status !== "completado" && t.dueDate && daysUntil(t.dueDate) < 0,
    );
    if (atrasadas.length === 0) {
      return "No tenés tareas atrasadas. Hay algunas pendientes pero todas dentro de fecha.";
    }
    return `Tenés ${atrasadas.length} tareas atrasadas:\n${atrasadas
      .map((t) => `· ${t.title} (responsable: ${t.responsible})`)
      .join("\n")}`;
  }

  return `Puedo ayudarte con finanzas del mes, próximos vencimientos, tareas del hogar y objetivos de ahorro. Probá preguntarme: "¿Llegamos bien a fin de mes?" o "¿Dónde podemos ahorrar?".`;
}
