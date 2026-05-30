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
import { shoppingList as seedShopping } from "@/lib/mock/shopping";
import { documents as seedDocuments } from "@/lib/mock/documents";
import { accounts as seedAccounts } from "@/lib/mock/accounts";
import { transactions as seedTransactions } from "@/lib/mock/transactions";
import type {
  Account,
  Bill,
  HouseholdDocument,
  HouseholdTask,
  ShoppingItem,
  Transaction,
} from "@/lib/types";

export interface PrivacySettings {
  /** Si false: Finanzas/Dashboard ocultan totales por integrante. */
  personalDetailsVisible: boolean;
  /** Si true: se comparten totales agregados por integrante. */
  shareAggregates: boolean;
}

interface AppState {
  transactions: Transaction[];
  bills: Bill[];
  tasks: HouseholdTask[];
  shopping: ShoppingItem[];
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
  | { type: "ADD_SHOPPING_ITEM"; payload: ShoppingItem }
  | { type: "TOGGLE_SHOPPING_ITEM"; payload: string }
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
  shopping: seedShopping,
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
    case "ADD_SHOPPING_ITEM":
      return { ...state, shopping: [action.payload, ...state.shopping] };
    case "TOGGLE_SHOPPING_ITEM":
      return {
        ...state,
        shopping: state.shopping.map((i) =>
          i.id === action.payload ? { ...i, bought: !i.bought } : i,
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

const STORAGE_KEY = "hogaria.store.v2";

interface AppStoreApi {
  state: AppState;
  addTransaction: (t: Transaction) => void;
  addBill: (b: Bill) => void;
  addTask: (t: HouseholdTask) => void;
  toggleTask: (id: string) => void;
  addShoppingItem: (i: ShoppingItem) => void;
  toggleShoppingItem: (id: string) => void;
  addDocument: (d: HouseholdDocument) => void;
  addAccount: (a: Account) => void;
  setPrivacy: (p: Partial<PrivacySettings>) => void;
  reset: () => void;
}

const StoreContext = createContext<AppStoreApi | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hidratar desde localStorage en cliente
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

  // Persistir cuando cambia (después de hidratado)
  useEffect(() => {
    if (!state.hydrated || typeof window === "undefined") return;
    const { hydrated: _h, ...persistable } = state;
    void _h;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch {
      /* localStorage lleno o privacy mode — ignoramos */
    }
  }, [state]);

  const api = useMemo<AppStoreApi>(
    () => ({
      state,
      addTransaction: (t) => dispatch({ type: "ADD_TRANSACTION", payload: t }),
      addBill: (b) => dispatch({ type: "ADD_BILL", payload: b }),
      addTask: (t) => dispatch({ type: "ADD_TASK", payload: t }),
      toggleTask: (id) => dispatch({ type: "TOGGLE_TASK", payload: id }),
      addShoppingItem: (i) => dispatch({ type: "ADD_SHOPPING_ITEM", payload: i }),
      toggleShoppingItem: (id) => dispatch({ type: "TOGGLE_SHOPPING_ITEM", payload: id }),
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
    [state],
  );

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useAppStore(): AppStoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useAppStore debe usarse dentro de AppStoreProvider");
  return ctx;
}

/** Para componentes que sólo necesitan leer un slice */
export function useTransactions() {
  return useAppStore().state.transactions;
}
export function useBills() {
  return useAppStore().state.bills;
}
export function useTasks() {
  return useAppStore().state.tasks;
}
export function useShopping() {
  return useAppStore().state.shopping;
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

/** Hook util: evita mismatch SSR/CSR */
export function useHasHydrated() {
  const { state } = useAppStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && state.hydrated;
}
