"use client";

import { cn } from "@/lib/utils";

interface Tab { key: string; label: string; }
interface TabsProps { tabs: Tab[]; activeKey: string; onChange: (k: string) => void; className?: string; }

export function Tabs({ tabs, activeKey, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex bg-ink-900/50 ring-1 ring-ink-800 p-1 gap-1 select-none", className)}>
      {tabs.map((tab) => (
        <button key={tab.key} onClick={() => onChange(tab.key)}
          className={cn(
            "flex-1 py-2 text-sm font-semibold tracking-wide transition-all duration-150",
            activeKey === tab.key
              ? "bg-caramel-500 text-white shadow-lift"
              : "text-ink-400 hover:text-ink-200"
          )}
        >{tab.label}</button>
      ))}
    </div>
  );
}
