"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ActionType =
  | "transaction"
  | "expense"
  | "income"
  | "personal-expense"
  | "task"
  | "bill"
  | "shopping"
  | "document"
  | "account";

export interface ActionDefaults {
  scope?: "hogar" | "personal" | "compartido";
  type?: "ingreso" | "gasto" | "transferencia" | "ahorro" | "inversion";
}

interface ActionApi {
  open: (type: ActionType, defaults?: ActionDefaults) => void;
  close: () => void;
  current: { type: ActionType; defaults?: ActionDefaults } | null;
}

const ActionContext = createContext<ActionApi | null>(null);

export function ActionProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<ActionApi["current"]>(null);

  const open = useCallback<ActionApi["open"]>((type, defaults) => {
    setCurrent({ type, defaults });
  }, []);

  const close = useCallback(() => setCurrent(null), []);

  const api = useMemo(() => ({ open, close, current }), [open, close, current]);

  return <ActionContext.Provider value={api}>{children}</ActionContext.Provider>;
}

export function useActions(): ActionApi {
  const ctx = useContext(ActionContext);
  if (!ctx) {
    // No-op fallback para SSR
    return { open: () => {}, close: () => {}, current: null };
  }
  return ctx;
}
