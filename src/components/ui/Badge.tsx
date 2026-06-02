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
    default: "bg-base-600 text-paper-300",
    accent: "bg-accent-500/20 text-accent-300 border border-accent-500/30",
    gold: "bg-gold-500/15 text-gold-300 border border-gold-500/25",
    sage: "bg-sage-500/15 text-sage-300 border border-sage-500/25",
    danger: "bg-red-500/15 text-red-300 border border-red-500/25",
  };
  const s: Record<string, string> = { sm: "px-2 py-0.5 text-2xs", md: "px-3 py-1 text-xs" };

  return <span className={cn("inline-flex items-center rounded-full font-medium select-none tracking-wide", v[variant], s[size], className)}>{children}</span>;
}
