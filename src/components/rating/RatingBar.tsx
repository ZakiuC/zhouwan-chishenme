"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

interface Props { label: string; score: number; max?: number; showVal?: boolean; }

export const RatingBar = memo(function RatingBar({ label, score, max = 5, showVal = true }: Props) {
  const pct = Math.min(100, (score / max) * 100);
  const color = pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-gold-400" : pct >= 40 ? "bg-amber-500" : "bg-base-500";
  return (
    <div className="flex items-center gap-2 select-none">
      <span className="text-xs text-paper-400 w-16 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-base-600 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-700", color)} style={{ width: `${pct}%` }} />
      </div>
      {showVal && <span className="text-xs font-medium text-paper-300 w-8 text-right tabular-nums">{score.toFixed(1)}</span>}
    </div>
  );
});
