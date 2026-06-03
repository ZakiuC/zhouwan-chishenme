"use client";

import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/ui/Icon";

interface EmptyStateProps { icon?: IconName; title: string; description?: string; action?: React.ReactNode; className?: string; }

export function EmptyState({ icon = "plate", title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center select-none", className)}>
      <Icon name={icon} size={40} className="text-ink-700 mb-5" />
      <h3 className="text-base font-bold text-ink-200 mb-1.5 tracking-wide">{title}</h3>
      {description && <p className="text-sm text-ink-500 max-w-xs">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
