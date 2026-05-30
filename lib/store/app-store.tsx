"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { bills as seedBills } from "@/lib/mock/bills";
import { tasks as seedTasks } from "@/lib/mock/tasks";
import { plannedPurchases as seedPurchases } from "@/lib/mock/planned-purchases";
import { documents as seedDocuments } from "@/lib/mock/documents";
import { accounts as seedAccounts } from "@/lib/mock/accounts";
import { transactions as seedTransactions } from "@/lib/mock/transactions";
import type {
  Account,
  Bill,
  HouseholdDocument,
  HouseholdTask,
  PlannedPurchase,
  PlannedPurchaseStatus,
  Transaction,
} from "@/lib/types";

export interface PrivacySettings {
  personalDetailsVisible: boolean;
  shareAggregates: boolean;
}

interface AppState {
  transactions: Transaction[];
  bills: Bill[];
  tasks: HouseholdTask[];
  purchases: PlannedPurchase[];
  documents: HouseholdDocument[];
  accounts: Account[];
  privacy: PrivacySettings;
  hydrated: boolean;
}

type Action =
  | { type: "HYDRATE"; payload: Partial<AppState> }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "ADD_BILL"; payload: Bill }
  | { type: "ADD_TASK"; payload: HouseholdTask }
  | { type: "TOGGLE_TASK"; payload: string }
  | { type: "ADD_PURCHASE"; payload: PlannedPurchase }
  | { type: "SET_PURCHASE_STATUS"; payload: { id: string; status: PlannedPurchaseStatus; linkedTransactionId?: string } }
  | { type: "ADD_DOCUMENT"; payload: HouseholdDocument }
  | { type: "ADD_ACCOUNT"; payload: Account }
  | { type: "SET_PRIVACY"; payload: Partial<PrivacySettings> }
  | { type: "RESET" };

const DEFAULT_PRIVACY: PrivacySettings = {
  personalDetailsVisible: false,
  shareAggregates: true,
};

const initialState: AppState = {
  transactions: seedTransactions,
  bills: seedBills,
  tasks: seedTasks,
  purchases: seedPurchases,
  documents: seedDocuments,
  accounts: seedAccounts,
  privacy: DEFAULT_PRIVACY,
  hydrated: false,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.payload, hydrated: true };
    case "ADD_TRANSACTION":
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case "ADD_BILL":
      return { ...state, bills: [action.payload, ...state.bills] };
    case "ADD_TASK":
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload
            ? { ...t, status: t.status === "completado" ? "pendiente" : "completado" }
            : t,
        ),
      };
    case "ADD_PURCHASE":
      return { ...state, purchases: [action.payload, ...state.purchases] };
    case "SET_PURCHASE_STATUS":
      return {
        ...state,
        purchases: state.purchases.map((p) =>
          p.id === action.payload.id
            ? {
                ...p,
                status: action.payload.status,
                linkedTransactionId:
                  action.payload.linkedTransactionId ?? p.linkedTransactionId,
              }
            : p,
        ),
      };
    case "ADD_DOCUMENT":
      return { ...state, documents: [action.payload, ...state.documents] };
    case "ADD_ACCOUNT":
      return { ...state, accounts: [action.payload, ...state.accounts] };
    case "SET_PRIVACY":
      return { ...state, privacy: { ...state.privacy, ...action.payload } };
    case "RESET":
      return { ...initialState, hydrated: true };
    default:
      return state;
  }
}

// Bump cuando cambia la forma del state (slice nuevo, etc.)
const STORAGE_KEY = "hogaria.store.v3";

/** Mapea la categoría de una compra prevista a la categoría del movimiento generado */
function mapPurchaseCategory(
  c: PlannedPurchase["category"],
): Transaction["category"] {
  switch (c) {
    case "Supermercado":
      return "Supermercado";
    case "Farmacia":
      return "Salud";
    case "Escolar":
      return "Educación";
    case "Mascotas":
      return "Mascotas";
    case "Limpieza":
    case "Hogar":
    case "Otros":
    default:
      return "Hogar";
  }
}

interface AppStoreApi {
  state: AppState;
  addTransaction: (t: Transaction) => void;
  addBill: (b: Bill) => void;
  addTask: (t: HouseholdTask) => void;
  toggleTask: (id: string) => void;
  addPurchase: (p: PlannedPurchase) => void;
  /**
   * Marca una compra prevista como realizada y crea automáticamente el
   * movimiento de gasto del hogar asociado. Devuelve el id de la
   * transacción creada (o null si ya estaba realizada / cancelada).
   */
  completePurchase: (id: string, actualAmount?: number) => string | null;
  cancelPurchase: (id: string) => void;
  addDocument: (d: HouseholdDocument) => void;
  addAccount: (a: Account) => void;
  setPrivacy: (p: Partial<PrivacySettings>) => void;
  reset: () => void;
}

const StoreContext = createContext<AppStoreApi | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AppState>;
        dispatch({ type: "HYDRATE", payload: parsed });
      } else {
        dispatch({ type: "HYDRATE", payload: {} });
      }
    } catch {
      dispatch({ type: "HYDRATE", payload: {} });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated || typeof window === "undefined") return;
    const { hydrated: _h, ...persistable } = state;
    void _h;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch {
      /* ignore */
    }
  }, [state]);

  const completePurchase = useCallback(
    (id: string, actualAmount?: number): string | null => {
      const purchase = state.purchases.find((p) => p.id === id);
      if (!purchase || purchase.status !== "prevista") return null;

      const amount = actualAmount ?? purchase.estimatedAmount;
      const txId = `tx-${Date.now()}`;
      const tx: Transaction = {
        id: txId,
        type: "gasto",
        kind: "variable",
        category: mapPurchaseCategory(purchase.category),
        description: purchase.title,
        amount,
        date: new Date().toISOString(),
        scope: "hogar",
        paymentMethod: "debito",
      };
      dispatch({ type: "ADD_TRANSACTION", payload: tx });
      dispatch({
        type: "SET_PURCHASE_STATUS",
        payload: { id, status: "realizada", linkedTransactionId: txId },
      });
      return txId;
    },
    [state.purchases],
  );

  const api = useMemo<AppStoreApi>(
    () => ({
      state,
      addTransaction: (t) => dispatch({ type: "ADD_TRANSACTION", payload: t }),
      addBill: (b) => dispatch({ type: "ADD_BILL", payload: b }),
      addTask: (t) => dispatch({ type: "ADD_TASK", payload: t }),
      toggleTask: (id) => dispatch({ type: "TOGGLE_TASK", payload: id }),
      addPurchase: (p) => dispatch({ type: "ADD_PURCHASE", payload: p }),
      completePurchase,
      cancelPurchase: (id) =>
        dispatch({ type: "SET_PURCHASE_STATUS", payload: { id, status: "cancelada" } }),
      addDocument: (d) => dispatch({ type: "ADD_DOCUMENT", payload: d }),
      addAccount: (a) => dispatch({ type: "ADD_ACCOUNT", payload: a }),
      setPrivacy: (p) => dispatch({ type: "SET_PRIVACY", payload: p }),
      reset: () => {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(STORAGE_KEY);
        }
        dispatch({ type: "RESET" });
      },
    }),
    [state, completePurchase],
  );

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useAppStore(): AppStoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useAppStore debe usarse dentro de AppStoreProvider");
  return ctx;
}

export function useTransactions() {
  return useAppStore().state.transactions;
}
export function useBills() {
  return useAppStore().state.bills;
}
export function useTasks() {
  return useAppStore().state.tasks;
}
export function usePurchases() {
  return useAppStore().state.purchases;
}
export function useDocuments() {
  return useAppStore().state.documents;
}
export function useAccounts() {
  return useAppStore().state.accounts;
}
export function usePrivacy() {
  return useAppStore().state.privacy;
}

export function useHasHydrated() {
  const { state } = useAppStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && state.hydrated;
}
