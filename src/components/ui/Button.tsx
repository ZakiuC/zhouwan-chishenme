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
    const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-800 disabled:opacity-30 disabled:cursor-not-allowed select-none active:scale-[0.97]";

    const variants: Record<string, string> = {
      primary:
        "bg-accent-500 text-white hover:bg-accent-400 focus:ring-accent-400 shadow-glow hover:shadow-[0_0_28px_rgba(199,91,57,0.4)] hover:-translate-y-0.5",
      secondary:
        "bg-gold-500 text-base-900 hover:bg-gold-400 focus:ring-gold-400 shadow-glow-gold hover:shadow-[0_0_24px_rgba(208,160,90,0.35)] hover:-translate-y-0.5",
      outline:
        "border border-base-400 text-paper-200 hover:bg-base-600 hover:border-base-300 focus:ring-accent-400",
      ghost:
        "text-paper-400 hover:text-paper-100 hover:bg-base-700 focus:ring-base-400",
      danger:
        "bg-red-600 text-white hover:bg-red-500 focus:ring-red-400 shadow-lg hover:shadow-red-900/30",
    };

    const sizes: Record<string, string> = {
      sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
      md: "h-10 px-5 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2 rounded-2xl",
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
