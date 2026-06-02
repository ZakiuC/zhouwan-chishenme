"use client";

import { cn } from "@/lib/utils";

interface Tab { key: string; label: string; icon?: string; }

interface TabsProps { tabs: Tab[]; activeKey: string; onChange: (key: string) => void; className?: string; }

export function Tabs({ tabs, activeKey, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex bg-base-700 rounded-xl p-1 gap-1 select-none", className)}>
      {tabs.map((tab) => (
        <button key={tab.key} onClick={() => onChange(tab.key)}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            activeKey === tab.key
              ? "bg-accent-500 text-white shadow-lg shadow-accent-500/20"
              : "text-paper-400 hover:text-paper-200 hover:bg-base-600"
          )}
        >
          {tab.icon && <span>{tab.icon}</span>}{tab.label}
        </button>
      ))}
    </div>
  );
}
