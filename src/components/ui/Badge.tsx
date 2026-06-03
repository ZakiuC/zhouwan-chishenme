"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "gold" | "sage" | "danger";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  const v: Record<string, string> = {
    default: "bg-ink-700 text-ink-300 ring-1 ring-ink-600",
    accent: "bg-caramel-500/10 text-caramel-400 ring-1 ring-caramel-500/20",
    gold: "bg-caramel-500/10 text-caramel-300 ring-1 ring-caramel-500/20",
    sage: "bg-sage-500/10 text-sage-400 ring-1 ring-sage-500/20",
    danger: "bg-rust-500/10 text-rust-400 ring-1 ring-rust-500/20",
  };
  const s: Record<string, string> = { sm: "px-2 py-0.5 text-2xs", md: "px-3 py-1 text-xs" };

  return (
    <span className={cn("inline-flex items-center font-medium select-none tracking-wide", v[variant], s[size], className)}>
      {children}
    </span>
  );
}
