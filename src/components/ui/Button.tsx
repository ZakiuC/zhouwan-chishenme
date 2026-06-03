"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 focus:outline-none disabled:opacity-20 disabled:cursor-not-allowed select-none";

    const variants: Record<string, string> = {
      primary:
        "bg-caramel-500 text-white hover:bg-caramel-400 active:bg-caramel-600 shadow-lift hover:shadow-intense hover:-translate-y-px",
      secondary:
        "bg-ink-700 text-ink-50 hover:bg-ink-600 active:bg-ink-800 shadow-lift",
      outline:
        "ring-1 ring-ink-600 text-ink-300 hover:text-ink-50 hover:ring-caramel-500 hover:bg-caramel-500/5",
      ghost:
        "text-ink-400 hover:text-ink-50 hover:bg-ink-800",
      danger:
        "bg-rust-500 text-white hover:bg-rust-400 active:bg-rust-600 shadow-lift",
    };

    const sizes: Record<string, string> = {
      sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
      md: "h-10 px-4 text-sm gap-2 rounded-lg",
      lg: "h-12 px-6 text-base gap-2 rounded-xl",
    };

    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
        {loading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
