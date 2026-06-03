"use client";

import { cn } from "@/lib/utils";

interface SelectOption { value: string; label: string; }
interface SelectProps { value: string; onChange: (v: string) => void; options: SelectOption[]; placeholder?: string; className?: string; }

export function Select({ value, onChange, options, placeholder = "请选择", className }: SelectProps) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-10 px-3 text-sm transition-all duration-150 appearance-none cursor-pointer",
        "bg-ink-900/80 ring-1 ring-ink-700 text-ink-200",
        "focus:outline-none focus:ring-caramel-500",
        "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%235C4B3A%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8",
        className
      )}
    >
      <option value="" className="bg-ink-900 text-ink-500">{placeholder}</option>
      {options.map((opt) => <option key={opt.value} value={opt.value} className="bg-ink-900 text-ink-200">{opt.label}</option>)}
    </select>
  );
}
