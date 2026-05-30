// =====================================================================
// Movimientos
// =====================================================================

export type TransactionType = "ingreso" | "gasto" | "transferencia" | "ahorro" | "inversion";
export type ExpenseKind = "fijo" | "variable";
export type TransactionScope = "hogar" | "personal" | "compartido";
export type PaymentMethod =
  | "efectivo"
  | "debito"
  | "credito"
  | "transferencia"
  | "mercadopago"
  | "cripto"
  | "otro";

export type TransactionCategory =
  | "Sueldo"
  | "Freelance"
  | "Otros ingresos"
  | "Alquiler"
  | "Expensas"
  | "Supermercado"
  | "Delivery"
  | "Transporte"
  | "Salud"
  | "Educación"
  | "Internet"
  | "Celular"
  | "Seguros"
  | "Tarjeta"
  | "Servicios"
  | "Entretenimiento"
  | "Hogar"
  | "Suscripciones"
  // Personales
  | "Peluquería"
  | "Gimnasio"
  | "Deportes"
  | "Ropa"
  | "Salidas"
  | "Cafetería"
  | "Apps personales"
  | "Cursos"
  | "Salud personal"
  | "Transporte personal"
  | "Hobbies"
  | "Mascotas"
  // Ahorro / inversión
  | "Ahorro"
  | "Inversión";

export interface Transaction {
  id: string;
  type: TransactionType;
  kind?: ExpenseKind;
  category: TransactionCategory;
  description: string;
  amount: number;
  date: string;
  account?: string;
  accountId?: string;
  recurring?: boolean;
  isRecurring?: boolean;
  scope?: TransactionScope;
  memberId?: string;
  linkedGoalId?: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

// =====================================================================
// Vencimientos
// =====================================================================

export type BillStatus = "pendiente" | "pagado" | "vencido" | "proximo";

export interface Bill {
  id: string;
  title: string;
  category: TransactionCategory;
  amount: number;
  dueDate: string;
  status: BillStatus;
  autoDebit?: boolean;
  responsible?: string;
}

// =====================================================================
// Hogar
// =====================================================================

export type TaskStatus = "pendiente" | "en-progreso" | "completado" | "vencido";
export type TaskPriority = "baja" | "media" | "alta";

export interface HouseholdTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  responsible: string;
  area: "limpieza" | "mantenimiento" | "compras" | "pagos" | "general";
}

// =====================================================================
// Objetivos
// =====================================================================

export type GoalStatus = "al-dia" | "atrasado" | "completado";

export interface Goal {
  id: string;
  title: string;
  target: number;
  saved: number;
  monthlyContribution: number;
  deadline: string;
  status: GoalStatus;
  emoji?: string;
  /** Cuenta o bolsillo donde se guarda el dinero del objetivo */
  accountId?: string;
}

// =====================================================================
// Compras, mantenimiento, documentos
// =====================================================================

export type ShoppingPriority = "baja" | "media" | "alta";

/**
 * @deprecated Reemplazado por `PlannedPurchase`. La carga producto por
 * producto se mantiene como modelo posible para una fase futura con
 * escaneo de ticket / OCR. El MVP actual trabaja con compras previstas
 * por bloque (concepto + monto).
 */
export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  estimatedPrice: number;
  category: "Almacén" | "Limpieza" | "Frescos" | "Bebidas" | "Higiene" | "Otros";
  priority: ShoppingPriority;
  bought: boolean;
}

// =====================================================================
// Compras previstas (bloques de compra, no items individuales)
// =====================================================================

export type PlannedPurchaseStatus = "prevista" | "realizada" | "cancelada";

export type PlannedPurchaseCategory =
  | "Supermercado"
  | "Limpieza"
  | "Farmacia"
  | "Mascotas"
  | "Hogar"
  | "Escolar"
  | "Otros";

export interface PlannedPurchase {
  id: string;
  /** Concepto / título de la compra (ej: "Supermercado semanal") */
  title: string;
  category: PlannedPurchaseCategory;
  /** Monto estimado (no necesariamente final) */
  estimatedAmount: number;
  /** Fecha prevista (cuándo se espera realizarla) */
  plannedDate: string;
  responsible?: string;
  status: PlannedPurchaseStatus;
  notes?: string;
  /** Si se marca como realizada, id del movimiento generado en transacciones */
  linkedTransactionId?: string;
}

export type MaintenanceStatus = "ok" | "proximo" | "atrasado";

export interface MaintenanceItem {
  id: string;
  title: string;
  asset: string;
  lastDone?: string;
  nextDue: string;
  intervalMonths: number;
  status: MaintenanceStatus;
  responsible?: string;
  notes?: string;
}

export interface HouseholdDocument {
  id: string;
  title: string;
  category: "Seguros" | "Servicios" | "Impuestos" | "Identidad" | "Salud" | "Vehículo";
  expiresAt?: string;
  fileName: string;
  uploadedAt: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  category: TransactionCategory;
  renewsAt: string;
}

// =====================================================================
// Hogar e integrantes
// =====================================================================

export interface HouseholdMember {
  id: string;
  name: string;
  role: "Administrador" | "Miembro" | "Invitado";
  avatarColor: string;
  initials: string;
  /** Presupuesto mensual personal sugerido */
  personalBudget?: number;
  /** Preferencia de perfil financiero del integrante */
  financialProfile?: FinancialProfile;
}

export interface Household {
  id: string;
  name: string;
  currency: "ARS" | "USD";
  members: HouseholdMember[];
  monthlyIncomeTarget: number;
}

// =====================================================================
// Cuentas, ahorro e inversiones
// =====================================================================

export type AccountKind =
  | "efectivo"
  | "caja-ahorro"
  | "cuenta-remunerada"
  | "billetera"
  | "dolares"
  | "fci"
  | "plazo-fijo"
  | "cripto";

export interface Account {
  id: string;
  name: string;
  kind: AccountKind;
  /** Saldo actual en la moneda del hogar (mock) */
  balance: number;
  /** Moneda nativa, sólo informativo */
  currency: "ARS" | "USD";
  /** Si la cuenta se considera parte del ahorro disponible */
  isSaving?: boolean;
  /** Si la cuenta es de un integrante puntual */
  memberId?: string;
  /** Color para gráficos / chips */
  color?: string;
  /** Nota corta */
  notes?: string;
}

export type InvestmentType =
  | "fci"
  | "plazo-fijo"
  | "dolar"
  | "acciones"
  | "bonos"
  | "cripto"
  | "otro";

export interface Investment {
  id: string;
  name: string;
  type: InvestmentType;
  /** Capital inicial mock */
  principal: number;
  /** Valor actual mock */
  currentValue: number;
  /** Fecha de creación / compra */
  startedAt: string;
  /** Vence o se libera (plazo fijo) */
  maturesAt?: string;
  memberId?: string;
  notes?: string;
}

export interface SavingPocket {
  id: string;
  name: string;
  /** Monto destinado en esta caja */
  amount: number;
  /** Objetivo asociado, si corresponde */
  goalId?: string;
  /** Cuenta donde se guarda */
  accountId?: string;
  emoji?: string;
}

export interface NetWorthSnapshot {
  month: string; // ej: "2026-01"
  assets: number;
  liabilities: number;
}

// =====================================================================
// Preferencias / perfiles financieros
// =====================================================================

export type FinancialProfile = "conservador" | "equilibrado" | "agresivo";

export interface PersonalBudget {
  memberId: string;
  /** Presupuesto total personal mensual */
  monthlyBudget: number;
  /** Distribución por categoría personal (opcional) */
  byCategory?: Partial<Record<TransactionCategory, number>>;
}

// =====================================================================
// Recomendaciones IA
// =====================================================================

export type RecommendationLevel = "info" | "atencion" | "alerta" | "positivo";
export type RecommendationModule = "finanzas" | "hogar" | "ia" | "calendario" | "general";

export type RecommendationGroup =
  | "finanzas"
  | "ahorro"
  | "inversiones"
  | "hogar"
  | "vencimientos"
  | "gastos-personales"
  | "objetivos"
  | "riesgo";

export type RecommendationPriority = "low" | "medium" | "high";

export interface AIRecommendation {
  id: string;
  level: RecommendationLevel;
  module: RecommendationModule;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: string;
  /** Agrupación temática para vistas con secciones */
  group?: RecommendationGroup;
  /** Prioridad de aparición */
  priority?: RecommendationPriority;
  /** Monto relacionado (ej. ahorro estimado, gasto observado) */
  relatedAmount?: number;
  /** Integrante al que apunta la recomendación, si aplica */
  memberId?: string;
}

export type HouseholdHealth = "estable" | "ajustado" | "alerta";
