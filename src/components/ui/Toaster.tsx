"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

type Toast = {
  id: string;
  title: string;
  description?: string;
  tone?: "success" | "error" | "info";
  timeout?: number;
};

type ToastContextValue = {
  push: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((toast: Omit<Toast, "id">) => {
    setToasts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        timeout: 4000,
        tone: "info",
        ...toast
      }
    ]);
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((toast) =>
      window.setTimeout(
        () =>
          setToasts((prev) => {
            const next = [...prev];
            const index = next.findIndex((item) => item.id === toast.id);
            if (index !== -1) next.splice(index, 1);
            return next;
          }),
        toast.timeout
      )
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [toasts]);

  const value = useMemo<ToastContextValue>(
    () => ({
      push
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center space-y-2 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full max-w-sm rounded-lg border bg-white/95 p-4 shadow transition dark:bg-gray-900/95 ${
              toast.tone === "success"
                ? "border-emerald-300 text-emerald-900"
                : toast.tone === "error"
                  ? "border-rose-300 text-rose-900"
                  : "border-slate-200 text-slate-900"
            }`}
          >
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.description ? (
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{toast.description}</p>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within the ToastProvider");
  }
  return context;
};
