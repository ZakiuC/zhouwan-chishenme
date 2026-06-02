"use client";

import { cn } from "@/lib/utils";

interface SelectOption { value: string; label: string; }

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function Select({ value, onChange, options, placeholder = "请选择", className }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-10 px-3 rounded-xl text-sm transition-all duration-200 appearance-none cursor-pointer",
        "bg-base-600 border border-base-400/50 text-paper-200",
        "focus:outline-none focus:ring-2 focus:ring-accent-400/30 focus:border-accent-400/50",
        "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%2380746A%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8",
        className
      )}
    >
      <option value="" className="bg-base-700 text-paper-400">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-base-700 text-paper-200">{opt.label}</option>
      ))}
    </select>
  );
}
