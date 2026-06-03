"use client";

import { memo } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { useRouter } from "next/navigation";
import { STORE_CATEGORIES } from "@/lib/constants";
import { formatRelativeTime } from "@/lib/utils";

interface StoreCardProps {
  store: { id: string; name: string; category: string | null; avgWantScore: number; compositeScore: number; ratingCount: number; recommendCount: number; createdAt: Date | string; hasPrivateRoom?: boolean; uploader?: { nickname: string | null } | null; _count?: { ratings: number } | null; };
  compact?: boolean;
}

function catLabel(v: string | null): string { if (!v) return "其他"; return STORE_CATEGORIES.find(c => c.value === v)?.label || "其他"; }

const Stars = memo(function Stars({ score }: { score: number }) {
  const n = Math.round(score);
  return <div className="flex gap-0.5 select-none">{ [1,2,3,4,5].map(s =>
    <Icon key={s} name="star" size={12} className={s <= n ? "text-caramel-400" : "text-ink-700"} />
  )}</div>;
});

export const StoreCard = memo(function StoreCard({ store, compact = false }: StoreCardProps) {
  const router = useRouter();
  const score = store.compositeScore || store.avgWantScore;
  return (
    <Card onClick={() => router.push(`/stores/${store.id}`)} padding="md" className="hover:ring-caramel-500/20">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-bold text-ink-100 text-sm truncate flex-1 tracking-wide">{store.name}</h4>
          <Badge variant="accent" size="sm">{catLabel(store.category)}</Badge>
        </div>
        <div className="flex items-center gap-3">
          <Stars score={score} />
          <span className="text-2xl font-bold text-caramel-400 tabular-nums">{score.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-4 text-2xs text-ink-500 font-mono">
          <span className="flex items-center gap-1"><Icon name="thumbs-up" size={10} />{store.recommendCount || 0}</span>
          <span className="flex items-center gap-1"><Icon name="pencil" size={10} />{(store._count?.ratings ?? store.ratingCount) || 0}</span>
          {!compact && store.hasPrivateRoom && <span className="text-caramel-500 flex items-center gap-1"><Icon name="sparkle" size={10} />包厢</span>}
          {!compact && store.uploader && <span className="flex items-center gap-1"><Icon name="user" size={10} />{store.uploader.nickname || "匿名"}</span>}
        </div>
        {!compact && <p className="text-2xs text-ink-600">{formatRelativeTime(store.createdAt)}添加</p>}
      </div>
    </Card>
  );
});
