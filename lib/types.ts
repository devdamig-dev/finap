export type TransactionType = "ingreso" | "gasto";
export type ExpenseKind = "fijo" | "variable";

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
  | "Suscripciones";

export interface Transaction {
  id: string;
  type: TransactionType;
  kind?: ExpenseKind;
  category: TransactionCategory;
  description: string;
  amount: number;
  date: string;
  account?: string;
  recurring?: boolean;
}

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
}

export type ShoppingPriority = "baja" | "media" | "alta";

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

export interface HouseholdMember {
  id: string;
  name: string;
  role: "Administrador" | "Miembro" | "Invitado";
  avatarColor: string;
  initials: string;
}

export interface Household {
  id: string;
  name: string;
  currency: "ARS" | "USD";
  members: HouseholdMember[];
  monthlyIncomeTarget: number;
}

export type RecommendationLevel = "info" | "atencion" | "alerta" | "positivo";
export type RecommendationModule = "finanzas" | "hogar" | "ia" | "calendario" | "general";

export interface AIRecommendation {
  id: string;
  level: RecommendationLevel;
  module: RecommendationModule;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: string;
}

export type HouseholdHealth = "estable" | "ajustado" | "alerta";
