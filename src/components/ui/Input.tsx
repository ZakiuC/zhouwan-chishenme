"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label htmlFor={id} className="block text-xs font-medium text-ink-300 mb-1.5 tracking-wide select-none uppercase">{label}</label>}
        <input ref={ref} id={id}
          className={cn(
            "w-full h-10 px-4 text-sm transition-all duration-150",
            "bg-ink-900/80 placeholder:text-ink-600 text-ink-50 ring-1",
            "focus:outline-none focus:ring-caramel-500",
            error ? "ring-rust-500" : "ring-ink-700 focus:ring-caramel-500",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-2xs text-rust-400">{error}</p>}
        {hint && !error && <p className="mt-1 text-2xs text-ink-500">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
