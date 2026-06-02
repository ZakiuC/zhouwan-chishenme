"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label htmlFor={id} className="block text-sm font-medium text-paper-300 mb-1.5 select-none">{label}</label>}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full h-10 px-4 rounded-xl text-sm transition-all duration-200",
            "bg-base-600 border placeholder:text-base-400 text-paper-100",
            "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-base-800",
            error
              ? "border-red-500/50 focus:ring-red-400"
              : "border-base-400/50 focus:border-accent-400/50 focus:ring-accent-400/30",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="mt-1 text-xs text-base-400">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
