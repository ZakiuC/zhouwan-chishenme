"use client";

import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/ui/Icon";

interface EmptyStateProps { icon?: IconName; title: string; description?: string; action?: React.ReactNode; className?: string; }

export function EmptyState({ icon = "plate", title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center select-none", className)}>
      <Icon name={icon} size={48} className="text-paper-600 mb-4" />
      <h3 className="text-base font-semibold text-paper-200 mb-1.5">{title}</h3>
      {description && <p className="text-sm text-paper-400 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
