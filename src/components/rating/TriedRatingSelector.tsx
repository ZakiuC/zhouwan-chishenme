"use client";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { TRIED_RATINGS } from "@/lib/constants";

interface Props { value: string; onChange: (v: string) => void; }

const styles: Record<string, string> = {
  STRONGLY_RECOMMEND: "border-emerald-700/40 bg-sage-500/10 text-sage-400 hover:bg-sage-500/20 data-[active=true]:bg-sage-500 data-[active=true]:text-white data-[active=true]:border-emerald-500 data-[active=true]:shadow-intense data-[active=true]:shadow-emerald-500/20",
  RECOMMEND: "border-blue-700/40 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 data-[active=true]:bg-blue-500 data-[active=true]:text-white data-[active=true]:border-blue-500 data-[active=true]:shadow-intense data-[active=true]:shadow-blue-500/20",
  NEUTRAL: "border-amber-700/40 bg-caramel-500/10 text-caramel-400 hover:bg-caramel-500/20 data-[active=true]:bg-caramel-500 data-[active=true]:text-white data-[active=true]:border-amber-500 data-[active=true]:shadow-intense data-[active=true]:shadow-amber-500/20",
  NOT_RECOMMEND: "border-red-700/40 bg-rust-500/10 text-rust-400 hover:bg-rust-500/20 data-[active=true]:bg-rust-500 data-[active=true]:text-white data-[active=true]:border-red-500 data-[active=true]:shadow-intense data-[active=true]:shadow-red-500/20",
  NOT_TRIED: "border-ink-800/40 bg-ink-800/50 text-ink-300 hover:bg-ink-700/50 data-[active=true]:bg-base-400 data-[active=true]:text-white data-[active=true]:border-ink-700",
};

export function TriedRatingSelector({ value, onChange }: Props) {
  return (
    <div>
      <span className="block text-sm font-medium text-ink-200 mb-2 select-none flex items-center gap-1">
        <Icon name="utensils" size={14} />吃过评级
      </span>
      <div className="grid grid-cols-5 gap-1.5 select-none">
        {TRIED_RATINGS.map(o => (
          <button key={o.value} type="button" data-active={value === o.value} onClick={() => onChange(o.value)}
            className={cn("py-2.5 px-1 rounded-xl border-2 text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95", styles[o.value])}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}
