"use client";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

interface StarRatingProps { value: number; onChange?: (v: number) => void; readonly?: boolean; size?: "sm"|"md"|"lg"; label?: React.ReactNode; }

const sz = { sm: 16, md: 22, lg: 28 };

export function StarRating({ value, onChange, readonly = false, size = "md", label }: StarRatingProps) {
  const iconSize = sz[size];
  return (
    <div>
      {label && <span className="block text-sm font-medium text-ink-200 mb-1.5 select-none">{label}</span>}
      <div className={cn("flex items-end gap-0.5 select-none")}>
        {[1,2,3,4,5].map(star => (
          <button key={star} type="button" disabled={readonly} onClick={() => onChange?.(star)}
            className={cn("transition-all duration-150 select-none",
              readonly ? "cursor-default" : "cursor-pointer hover:scale-125 hover:-translate-y-0.5",
              star <= value ? "text-caramel-400" : "text-base-500 hover:text-ink-500")}
            aria-label={`${star}星`}>
            <Icon name="star" size={iconSize} />
          </button>
        ))}
        {!readonly && <span className="text-xs text-ink-500 ml-2 mb-0.5 select-none">{value > 0 ? `${value}/5` : "点击评分"}</span>}
      </div>
    </div>
  );
}
