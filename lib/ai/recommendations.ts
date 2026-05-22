import { bills as defaultBills } from "@/lib/mock/bills";
import { goals as defaultGoals } from "@/lib/mock/goals";
import { maintenanceItems as defaultMaintenance } from "@/lib/mock/maintenance";
import { tasks as defaultTasks } from "@/lib/mock/tasks";
import {
  householdTransactions as defaultHouseholdTransactions,
  subscriptions as defaultSubscriptions,
  transactions as defaultTransactions,
} from "@/lib/mock/transactions";
import {
  personalExpenses as defaultPersonalExpenses,
  getPersonalSpentByMember,
} from "@/lib/mock/personal-expenses";
import {
  averageMonthlyExpense,
  monthlySavingContribution,
  savingPockets as defaultSavingPockets,
  getEmergencyFundCoverageMonths,
  getUnallocatedSavings,
} from "@/lib/mock/savings";
import { investments as defaultInvestments } from "@/lib/mock/investments";
import { members as defaultMembers, personalBudgets } from "@/lib/mock/members";
import type {
  AIRecommendation,
  Bill,
  Goal,
  HouseholdMember,
  HouseholdTask,
  Investment,
  MaintenanceItem,
  RecommendationGroup,
  RecommendationPriority,
  SavingPocket,
  Subscription,
  Transaction,
} from "@/lib/types";
import { daysUntil, formatCurrency, percentage } from "@/lib/utils";

export interface RecommendationInput {
  transactions?: Transaction[];
  householdTransactions?: Transaction[];
  personalExpenses?: Transaction[];
  bills?: Bill[];
  tasks?: HouseholdTask[];
  goals?: Goal[];
  subscriptions?: Subscription[];
  maintenance?: MaintenanceItem[];
  savingPockets?: SavingPocket[];
  investments?: Investment[];
  members?: HouseholdMember[];
}

function sum(list: Transaction[]) {
  return list.reduce((acc, t) => acc + t.amount, 0);
}

const priorityWeight: Record<RecommendationPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

/**
 * Resumen mensual considerando sólo los movimientos del hogar (no personales).
 * Los gastos personales viven en su propio universo de presupuesto y se
 * miden por separado.
 */
export function getMonthlySummary(transactions: Transaction[] = defaultHouseholdTransactions) {
  const incomes = transactions.filter((t) => t.type === "ingreso");
  const expenses = transactions.filter((t) => t.type === "gasto");
  const fixed = expenses.filter((t) => t.kind === "fijo");
  const variable = expenses.filter((t) => t.kind === "variable");
  const savings = transactions.filter((t) => t.type === "ahorro" || t.type === "inversion");

  const totalIncome = sum(incomes);
  const totalExpense = sum(expenses);
  const totalFixed = sum(fixed);
  const totalVariable = sum(variable);
  const totalSaved = sum(savings);

  return {
    totalIncome,
    totalExpense,
    totalFixed,
    totalVariable,
    totalSaved,
    balance: totalIncome - totalExpense,
    savingRate: totalIncome > 0 ? Math.max(0, (totalIncome - totalExpense) / totalIncome) : 0,
    fixedShare: totalIncome > 0 ? totalFixed / totalIncome : 0,
  };
}

export function getExpenseByCategory(transactions: Transaction[] = defaultHouseholdTransactions) {
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
 * Analiza los datos del hogar y emite insights útiles y accionables,
 * agrupados por tipo y con prioridad sugerida.
 */
export function generateRecommendations(
  input: RecommendationInput = {},
): AIRecommendation[] {
  const transactions = input.transactions ?? defaultTransactions;
  const householdTx = input.householdTransactions ?? defaultHouseholdTransactions;
  const personalTx = input.personalExpenses ?? defaultPersonalExpenses;
  const bills = input.bills ?? defaultBills;
  const tasks = input.tasks ?? defaultTasks;
  const goals = input.goals ?? defaultGoals;
  const subscriptions = input.subscriptions ?? defaultSubscriptions;
  const maintenance = input.maintenance ?? defaultMaintenance;
  const savingPockets = input.savingPockets ?? defaultSavingPockets;
  const investments = input.investments ?? defaultInvestments;
  const members = input.members ?? defaultMembers;

  const recs: AIRecommendation[] = [];
  const summary = getMonthlySummary(householdTx);
  const byCategory = getExpenseByCategory(householdTx);

  const push = (
    rec: Omit<AIRecommendation, "group" | "priority"> &
      Partial<Pick<AIRecommendation, "group" | "priority">>,
  ) => {
    recs.push({ priority: "medium", group: "finanzas", ...rec });
  };

  // ====================================================================
  // FINANZAS — Saldo y estructura general
  // ====================================================================

  if (summary.totalExpense > summary.totalIncome * 0.85) {
    const restante = summary.totalIncome - summary.totalExpense;
    push({
      id: "rec-saldo-ajustado",
      level: restante < 0 ? "alerta" : "atencion",
      module: "finanzas",
      group: restante < 0 ? "riesgo" : "finanzas",
      priority: restante < 0 ? "high" : "medium",
      title: restante < 0 ? "El mes cierra en rojo" : "El mes viene ajustado",
      description:
        restante < 0
          ? `Estás gastando ${formatCurrency(Math.abs(restante))} más de lo que entra. Conviene revisar gastos variables esta semana.`
          : `Ya gastaste el ${percentage(summary.totalExpense, summary.totalIncome)}% de tus ingresos. Queda margen chico (${formatCurrency(restante)}) para imprevistos.`,
      actionLabel: "Ver finanzas",
      actionHref: "/dashboard/finanzas",
      relatedAmount: Math.abs(restante),
    });
  } else if (summary.savingRate > 0.2) {
    push({
      id: "rec-ahorro-bueno",
      level: "positivo",
      module: "finanzas",
      group: "ahorro",
      priority: "low",
      title: "Buen ritmo de ahorro",
      description: `Vas ahorrando ${formatCurrency(summary.balance)} este mes (${Math.round(summary.savingRate * 100)}% de tus ingresos). Si querés, podés sumar ese excedente a un objetivo.`,
      actionLabel: "Ver objetivos",
      actionHref: "/dashboard/finanzas",
      relatedAmount: summary.balance,
    });
  }

  if (summary.fixedShare > 0.55) {
    push({
      id: "rec-fijos-altos",
      level: "atencion",
      module: "finanzas",
      group: "finanzas",
      priority: "medium",
      title: `Tus gastos fijos son el ${Math.round(summary.fixedShare * 100)}% de tus ingresos`,
      description:
        "Cuando los fijos pasan el 55%, el hogar pierde flexibilidad ante imprevistos. Revisar seguros, planes de salud o servicios suele dar márgenes interesantes.",
      actionLabel: "Revisar gastos fijos",
      actionHref: "/dashboard/finanzas",
    });
  }

  const topCategory = byCategory[0];
  if (topCategory && summary.totalExpense > 0) {
    const share = topCategory.amount / summary.totalExpense;
    if (share > 0.25 && topCategory.category !== "Alquiler") {
      push({
        id: `rec-cat-${topCategory.category}`,
        level: "atencion",
        module: "finanzas",
        group: "finanzas",
        title: `${topCategory.category} se llevó el ${Math.round(share * 100)}% del mes`,
        description: `Gastaste ${formatCurrency(topCategory.amount)} en ${topCategory.category}. Podés revisar si hay forma de bajarlo el mes que viene.`,
        actionLabel: "Ver detalle",
        actionHref: "/dashboard/finanzas",
        relatedAmount: topCategory.amount,
      });
    }
  }

  const delivery = householdTx.filter((t) => t.type === "gasto" && t.category === "Delivery");
  if (delivery.length >= 3) {
    const total = sum(delivery);
    push({
      id: "rec-delivery",
      level: "atencion",
      module: "finanzas",
      group: "finanzas",
      title: `${delivery.length} pedidos de delivery este mes`,
      description: `Sumaste ${formatCurrency(total)} en delivery. Planificar una o dos cenas más por semana puede liberar bastante presupuesto.`,
      actionLabel: "Crear plan de compras",
      actionHref: "/dashboard/hogar",
      relatedAmount: total,
    });
  }

  // ====================================================================
  // AHORRO
  // ====================================================================

  if (summary.totalIncome > 0) {
    const rate = summary.savingRate;
    if (rate < 0.1) {
      push({
        id: "rec-ahorro-bajo",
        level: "atencion",
        module: "finanzas",
        group: "ahorro",
        priority: "medium",
        title: `Tu tasa de ahorro este mes es ${Math.round(rate * 100)}%`,
        description:
          "Una guía orientativa es apuntar al 10–20% de los ingresos. Empezar por separar un monto chico apenas entra el sueldo suele ser lo más efectivo.",
        actionLabel: "Ver ahorro e inversiones",
        actionHref: "/dashboard/finanzas",
      });
    } else if (rate >= 0.3) {
      push({
        id: "rec-ahorro-alto",
        level: "positivo",
        module: "finanzas",
        group: "ahorro",
        priority: "low",
        title: `Estás ahorrando el ${Math.round(rate * 100)}% de tus ingresos`,
        description:
          "Podés asignar una parte al fondo de emergencia y otra a objetivos puntuales para que ese ahorro tenga propósito.",
        actionLabel: "Asignar ahorro",
        actionHref: "/dashboard/finanzas",
        relatedAmount: summary.balance,
      });
    }
  }

  const emergencyMonths = getEmergencyFundCoverageMonths();
  if (emergencyMonths > 0 && emergencyMonths < 3) {
    push({
      id: "rec-fondo-emergencia",
      level: "atencion",
      module: "finanzas",
      group: "ahorro",
      priority: "medium",
      title: `Fondo de emergencia: ${emergencyMonths} ${emergencyMonths === 1 ? "mes" : "meses"} de cobertura`,
      description: `Una meta saludable inicial suele ser cubrir 3 meses de gastos (${formatCurrency(averageMonthlyExpense * 3)}). Sumar de a poco te acerca sin presión.`,
      actionLabel: "Reforzar fondo",
      actionHref: "/dashboard/finanzas",
    });
  }

  const unallocated = getUnallocatedSavings();
  if (unallocated > 80000) {
    push({
      id: "rec-sin-asignar",
      level: "info",
      module: "finanzas",
      group: "ahorro",
      priority: "low",
      title: `Tenés ${formatCurrency(unallocated)} de ahorro sin asignar`,
      description:
        "Podés distribuirlo entre fondo de emergencia, vacaciones y arreglos del hogar para que tu ahorro tenga destino.",
      actionLabel: "Distribuir ahorro",
      actionHref: "/dashboard/finanzas",
      relatedAmount: unallocated,
    });
  }

  // ====================================================================
  // INVERSIONES
  // ====================================================================

  if (investments.length === 0 && summary.savingRate > 0.15) {
    push({
      id: "rec-sin-inversiones",
      level: "info",
      module: "finanzas",
      group: "inversiones",
      priority: "low",
      title: "No tenés inversiones registradas",
      description:
        "Antes de invertir conviene cubrir el fondo de emergencia y los vencimientos del mes. Esto no es asesoramiento financiero: usalo como guía para organizarte.",
      actionLabel: "Ver ahorro e inversiones",
      actionHref: "/dashboard/finanzas",
    });
  } else if (investments.length > 0) {
    const total = investments.reduce((acc, i) => acc + i.currentValue, 0);
    push({
      id: "rec-inversiones-revisar",
      level: "info",
      module: "finanzas",
      group: "inversiones",
      priority: "low",
      title: `Tenés ${investments.length} inversiones registradas`,
      description: `Suman ${formatCurrency(total)}. Buen momento para revisarlas y confirmar que sigan alineadas con tu perfil. Esto no es asesoramiento financiero.`,
      actionLabel: "Ver inversiones",
      actionHref: "/dashboard/finanzas",
      relatedAmount: total,
    });
  }

  if (emergencyMonths < 2 && investments.length > 0) {
    push({
      id: "rec-emergencia-antes-invertir",
      level: "atencion",
      module: "finanzas",
      group: "inversiones",
      priority: "medium",
      title: "Antes de invertir más, conviene reforzar el fondo de emergencia",
      description:
        "Tener al menos 2–3 meses de gastos cubiertos antes de aumentar inversiones reduce el riesgo de tener que rescatar a destiempo.",
      actionLabel: "Ver ahorro",
      actionHref: "/dashboard/finanzas",
    });
  }

  // ====================================================================
  // VENCIMIENTOS
  // ====================================================================

  const proximos = bills.filter((b) => {
    const d = daysUntil(b.dueDate);
    return b.status !== "pagado" && d >= 0 && d <= 5;
  });
  if (proximos.length > 0) {
    const total = proximos.reduce((acc, b) => acc + b.amount, 0);
    push({
      id: "rec-vencimientos",
      level: "atencion",
      module: "calendario",
      group: "vencimientos",
      priority: "medium",
      title: `${proximos.length} vencimientos en los próximos días`,
      description: `Por ${formatCurrency(total)} en total. Buen momento para separar la plata o programar el débito.`,
      actionLabel: "Ver vencimientos",
      actionHref: "/dashboard/calendario",
      relatedAmount: total,
    });
  }

  const vencidos = bills.filter((b) => b.status === "vencido");
  if (vencidos.length > 0) {
    push({
      id: "rec-vencidos",
      level: "alerta",
      module: "calendario",
      group: "riesgo",
      priority: "high",
      title: `${vencidos.length} ${vencidos.length === 1 ? "vencimiento vencido" : "vencimientos vencidos"}`,
      description: `Hay pagos atrasados por ${formatCurrency(vencidos.reduce((a, b) => a + b.amount, 0))}. Resolverlos hoy evita recargos.`,
      actionLabel: "Ir a pagar",
      actionHref: "/dashboard/calendario",
    });
  }

  // ====================================================================
  // HOGAR
  // ====================================================================

  const tareasVencidas = tasks.filter(
    (t) => t.status !== "completado" && t.dueDate && daysUntil(t.dueDate) < 0,
  );
  if (tareasVencidas.length > 0) {
    push({
      id: "rec-tareas-vencidas",
      level: "atencion",
      module: "hogar",
      group: "hogar",
      priority: "medium",
      title: `${tareasVencidas.length} ${tareasVencidas.length === 1 ? "tarea atrasada" : "tareas atrasadas"} en el hogar`,
      description: tareasVencidas
        .slice(0, 2)
        .map((t) => `· ${t.title} (${t.responsible})`)
        .join("\n"),
      actionLabel: "Ver tareas",
      actionHref: "/dashboard/hogar",
    });
  }

  const mantAtrasado = maintenance.filter((m) => m.status === "atrasado");
  if (mantAtrasado.length > 0) {
    push({
      id: "rec-mant-atrasado",
      level: "alerta",
      module: "hogar",
      group: "hogar",
      priority: "high",
      title: "Hay mantenimientos del hogar atrasados",
      description: mantAtrasado
        .slice(0, 2)
        .map((m) => `· ${m.title} — ${m.asset}`)
        .join("\n"),
      actionLabel: "Ver mantenimiento",
      actionHref: "/dashboard/hogar",
    });
  }

  // ====================================================================
  // OBJETIVOS
  // ====================================================================

  const objetivoAtrasado = goals.find((g) => g.status === "atrasado");
  if (objetivoAtrasado) {
    const restante = objetivoAtrasado.target - objetivoAtrasado.saved;
    const semanasHasta = Math.max(
      4,
      Math.round((new Date(objetivoAtrasado.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 7)),
    );
    const aporteSemanal = Math.round(restante / semanasHasta);
    push({
      id: `rec-goal-${objetivoAtrasado.id}`,
      level: "atencion",
      module: "finanzas",
      group: "objetivos",
      priority: "medium",
      title: `"${objetivoAtrasado.title}" está atrasado`,
      description: `Si querés llegar a la meta, sumando ${formatCurrency(aporteSemanal)} por semana volvés al ritmo previsto.`,
      actionLabel: "Ajustar objetivo",
      actionHref: "/dashboard/finanzas",
      relatedAmount: aporteSemanal,
    });
  }

  // ====================================================================
  // SUSCRIPCIONES Y COMPRAS
  // ====================================================================

  if (subscriptions.length >= 3) {
    const totalSubs = subscriptions.reduce((a, s) => a + s.amount, 0);
    push({
      id: "rec-subs",
      level: "info",
      module: "finanzas",
      group: "finanzas",
      priority: "low",
      title: `Tenés ${subscriptions.length} suscripciones activas`,
      description: `Suman ${formatCurrency(totalSubs)} por mes. Revisar cuáles se usan menos puede liberar ${formatCurrency(Math.round(totalSubs * 0.3))} sin esfuerzo.`,
      actionLabel: "Revisar suscripciones",
      actionHref: "/dashboard/finanzas",
      relatedAmount: totalSubs,
    });
  }

  const comprasSuper = householdTx.filter(
    (t) => t.type === "gasto" && t.category === "Supermercado",
  );
  if (comprasSuper.length >= 3) {
    push({
      id: "rec-compras-super",
      level: "info",
      module: "hogar",
      group: "hogar",
      priority: "low",
      title: "Hiciste varias compras chicas de supermercado",
      description: `${comprasSuper.length} visitas este mes. Agruparlas en una compra grande semanal suele ahorrar entre un 10 y 15%.`,
      actionLabel: "Armar lista",
      actionHref: "/dashboard/hogar",
    });
  }

  // ====================================================================
  // GASTOS PERSONALES POR INTEGRANTE
  // ====================================================================

  const totalPersonal = personalTx.reduce((acc, t) => acc + t.amount, 0);
  if (summary.totalExpense > 0 && totalPersonal > 0) {
    const share = totalPersonal / (summary.totalExpense + totalPersonal);
    if (share > 0.15) {
      push({
        id: "rec-personales-share",
        level: "info",
        module: "finanzas",
        group: "gastos-personales",
        priority: "low",
        title: `Los gastos personales son el ${Math.round(share * 100)}% del total del hogar`,
        description:
          "Separar gastos personales de gastos del hogar mejora la lectura del presupuesto familiar y evita discusiones por temas que no son del hogar.",
        actionLabel: "Ver gastos personales",
        actionHref: "/dashboard/finanzas",
        relatedAmount: totalPersonal,
      });
    }
  }

  for (const m of members) {
    const spent = getPersonalSpentByMember(m.id);
    const budget = personalBudgets.find((p) => p.memberId === m.id)?.monthlyBudget ?? m.personalBudget ?? 0;
    if (spent === 0 || budget === 0) continue;
    const ratio = spent / budget;
    if (ratio > 1) {
      push({
        id: `rec-personal-over-${m.id}`,
        level: "atencion",
        module: "finanzas",
        group: "gastos-personales",
        priority: "medium",
        memberId: m.id,
        title: `${m.name} superó su presupuesto personal en ${Math.round((ratio - 1) * 100)}%`,
        description: `Gastó ${formatCurrency(spent)} contra un presupuesto de ${formatCurrency(budget)}. Buen momento para revisar y, si hace falta, ajustar el límite.`,
        actionLabel: `Ver gastos de ${m.name}`,
        actionHref: "/dashboard/finanzas",
        relatedAmount: spent - budget,
      });
    } else if (ratio < 0.5 && spent > 0) {
      push({
        id: `rec-personal-ok-${m.id}`,
        level: "positivo",
        module: "finanzas",
        group: "gastos-personales",
        priority: "low",
        memberId: m.id,
        title: `${m.name} está dentro de su presupuesto personal`,
        description: `Gastó ${formatCurrency(spent)} de ${formatCurrency(budget)}. Sigue con margen para el resto del mes.`,
        actionLabel: `Ver detalle`,
        actionHref: "/dashboard/finanzas",
        relatedAmount: spent,
      });
    }
  }

  // Ordenar por prioridad
  return recs.sort(
    (a, b) =>
      priorityWeight[a.priority ?? "medium"] - priorityWeight[b.priority ?? "medium"],
  );
}

export function generateRecommendationsByGroup(
  input: RecommendationInput = {},
): Record<RecommendationGroup, AIRecommendation[]> {
  const all = generateRecommendations(input);
  const groups: Record<RecommendationGroup, AIRecommendation[]> = {
    finanzas: [],
    ahorro: [],
    inversiones: [],
    hogar: [],
    vencimientos: [],
    "gastos-personales": [],
    objetivos: [],
    riesgo: [],
  };
  for (const r of all) {
    const g = r.group ?? "finanzas";
    groups[g].push(r);
  }
  return groups;
}

export function getHouseholdHealth(transactions: Transaction[] = defaultHouseholdTransactions): {
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
  const summary = getMonthlySummary(defaultHouseholdTransactions);
  const byCategory = getExpenseByCategory(defaultHouseholdTransactions);

  if (q.includes("ahorr")) {
    const rate = Math.round(summary.savingRate * 100);
    const months = getEmergencyFundCoverageMonths();
    return `Tu tasa de ahorro este mes es del ${rate}%. Aporte mensual estimado: ${formatCurrency(monthlySavingContribution)}. Tu fondo de emergencia cubre ${months} ${months === 1 ? "mes" : "meses"} de gastos. Un buen primer techo suele ser 3 meses.`;
  }

  if (q.includes("invert") || q.includes("inversion") || q.includes("inversi")) {
    const total = defaultInvestments.reduce((a, i) => a + i.currentValue, 0);
    return `Tenés ${defaultInvestments.length} inversiones registradas por ${formatCurrency(total)}. Esto no es asesoramiento financiero: revisalas pensando en horizonte, liquidez y tu perfil.`;
  }

  if (q.includes("patrimon")) {
    const total = defaultInvestments.reduce((a, i) => a + i.currentValue, 0);
    return `Tu patrimonio estimado se compone de cuentas + inversiones (${formatCurrency(total)} en inversiones). Restando deudas de tarjetas, el neto queda en el orden de los ${formatCurrency(1691000)}.`;
  }

  if (q.includes("fin de mes") || q.includes("llegamos") || q.includes("llegar")) {
    if (summary.balance < 0) {
      return `Por ahora el mes cierra negativo: gastaste ${formatCurrency(summary.totalExpense)} contra ${formatCurrency(summary.totalIncome)} de ingresos. Te recomiendo bajar delivery y posponer compras no urgentes.`;
    }
    if (summary.savingRate < 0.1) {
      return `Vas justo. Te queda un margen de ${formatCurrency(summary.balance)} para los próximos días. Si cuidás los variables, llegás bien.`;
    }
    return `Sí, llegan bien. Tienen un excedente proyectado de ${formatCurrency(summary.balance)}. Buen momento para reforzar el fondo de emergencia.`;
  }

  if (q.includes("camila") || q.includes("martín") || q.includes("martin") || q.includes("lucía") || q.includes("lucia")) {
    const target = defaultMembers.find((m) => q.includes(m.name.toLowerCase()));
    if (target) {
      const spent = getPersonalSpentByMember(target.id);
      const budget = personalBudgets.find((p) => p.memberId === target.id)?.monthlyBudget ?? 0;
      return `${target.name} gastó ${formatCurrency(spent)} en gastos personales este mes${budget ? ` sobre un presupuesto de ${formatCurrency(budget)} (${Math.round((spent / budget) * 100)}%)` : ""}.`;
    }
  }

  if (q.includes("personal")) {
    const total = defaultPersonalExpenses.reduce((a, t) => a + t.amount, 0);
    return `Los gastos personales del hogar suman ${formatCurrency(total)} este mes. Podés filtrar por integrante en Finanzas → Gastos personales.`;
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

  if (q.includes("plan") || q.includes("armame")) {
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

  return `Puedo ayudarte con finanzas del mes, ahorro, inversiones, vencimientos, tareas del hogar y gastos personales. Probá preguntarme: "¿Cuánto estamos ahorrando?", "¿Llegamos bien a fin de mes?" o "¿Cuánto gastó Camila?".`;
}
