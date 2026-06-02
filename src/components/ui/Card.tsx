"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: "none" | "sm" | "md" | "lg";
  glow?: boolean;
}

export function Card({ children, className, onClick, padding = "md", glow = false }: CardProps) {
  const p: Record<string, string> = { none: "", sm: "p-3", md: "p-4", lg: "p-6" };
  const Component = onClick ? "button" : "div";

  return (
    <Component
      className={cn(
        "bg-base-700/80 backdrop-blur-sm rounded-2xl border border-base-500/50 shadow-card select-none",
        glow && "shadow-glow border-accent-500/20",
        onClick && "cursor-pointer hover:bg-base-600/80 hover:border-base-400/50 hover:shadow-card-hover active:scale-[0.99] hover:-translate-y-0.5 w-full text-left transition-all duration-300",
        !onClick && "transition-colors duration-200",
        p[padding],
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}
