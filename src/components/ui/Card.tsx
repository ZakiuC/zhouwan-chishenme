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
        "bg-ink-800/60 ring-1 ring-ink-700/50 select-none",
        glow && "ring-caramel-500/30 shadow-intense",
        onClick && "cursor-pointer hover:bg-ink-700/60 hover:ring-caramel-500/20 hover:shadow-card-hover active:scale-[0.995] w-full text-left transition-all duration-200",
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
