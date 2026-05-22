"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "info" | "warning";

interface Toast {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastApi {
  show: (input: Omit<Toast, "id" | "tone"> & { tone?: ToastTone }) => void;
  success: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const ICONS = {
  success: CheckCircle2,
  info: Info,
  warning: TriangleAlert,
} as const;

const TONES = {
  success: "bg-success-soft text-[hsl(var(--success))] border-[hsl(var(--success))]/30",
  info: "bg-accent text-accent-foreground border-primary/20",
  warning: "bg-warning-soft text-[hsl(var(--warning-foreground))] border-[hsl(var(--warning))]/30",
} as const;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback<ToastApi["show"]>((input) => {
    const id = `t-${++idRef.current}`;
    const toast: Toast = { id, title: input.title, description: input.description, tone: input.tone ?? "success" };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => remove(id), 3500);
  }, [remove]);

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (title, description) => show({ title, description, tone: "success" }),
      info: (title, description) => show({ title, description, tone: "info" }),
      warning: (title, description) => show({ title, description, tone: "warning" }),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => {
          const Icon = ICONS[t.tone];
          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-xl border bg-card p-3 shadow-lg animate-fade-in",
                TONES[t.tone],
              )}
            >
              <Icon className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{t.title}</p>
                {t.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                )}
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => remove(t.id)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // En SSR el provider aún no montó. Fallback silencioso.
    return {
      show: () => {},
      success: () => {},
      info: () => {},
      warning: () => {},
    };
  }
  return ctx;
}

// Suprimir warning de unused import en SSR
void useEffect;
