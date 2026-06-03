"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/ui/Icon";

type ToastType = "success" | "error" | "info";
interface ToastItem { id: string; message: string; type: ToastType; }

const Ctx = createContext<{ showToast: (m: string, t?: ToastType) => void }>({ showToast: () => {} });
export function useToast() { return useContext(Ctx); }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);

  const styles: Record<ToastType, string> = {
    success: "bg-emerald-600 text-white",
    error: "bg-red-600 text-white",
    info: "bg-ink-800 text-ink-50 border border-ink-700/50",
  };

  const icons: Record<ToastType, IconName> = { success: "check", error: "cross", info: "info" };

  return <Ctx.Provider value={{ showToast }}>
    {children}
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={cn("px-4 py-2.5 rounded-xl shadow-intense text-sm font-medium animate-fade-up pointer-events-auto flex items-center gap-2 select-none", styles[t.type])}>
          <Icon name={icons[t.type]} size={16} />{t.message}
        </div>
      ))}
    </div>
  </Ctx.Provider>;
}
