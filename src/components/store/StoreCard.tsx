"use client";

import { memo } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { useRouter } from "next/navigation";
import { STORE_CATEGORIES } from "@/lib/constants";
import { formatRelativeTime } from "@/lib/utils";

interface StoreCardProps {
  store: {
    id: string; name: string; category: string | null; avgWantScore: number;
    compositeScore: number; ratingCount: number; recommendCount: number;
    createdAt: Date | string;
    hasPrivateRoom?: boolean;
    uploader?: { nickname: string | null } | null;
    _count?: { ratings: number } | null;
  };
  compact?: boolean;
}

function catLabel(v: string | null): string { if (!v) return "其他"; return STORE_CATEGORIES.find(c => c.value === v)?.label || "其他"; }

const Stars = memo(function Stars({ score, size = 14 }: { score: number; size?: number }) {
  const n = Math.round(score);
  return <div className="flex gap-0.5 select-none">{ [1,2,3,4,5].map(s =>
    <Icon key={s} name="star" size={size} className={s <= n ? "text-gold-400" : "text-base-500"} />
  )}</div>;
});

export const StoreCard = memo(function StoreCard({ store, compact = false }: StoreCardProps) {
  const router = useRouter();
  return (
    <Card onClick={() => router.push(`/stores/${store.id}`)} padding="md" className="hover:border-accent-500/30">
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-paper-100 text-sm truncate flex-1">{store.name}</h4>
          <Badge variant="accent">{catLabel(store.category)}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Stars score={store.compositeScore || store.avgWantScore} size={14} />
          <span className="text-xs font-medium text-paper-400">{(store.compositeScore || store.avgWantScore).toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-3 text-2xs text-paper-500 flex-wrap">
          <span className="flex items-center gap-0.5"><Icon name="thumbs-up" size={11} />{store.recommendCount || 0}</span>
          <span className="flex items-center gap-0.5"><Icon name="pencil" size={11} />{(store._count?.ratings ?? store.ratingCount) || 0} 人评分</span>
          {!compact && store.hasPrivateRoom && <span className="flex items-center gap-0.5 text-gold-400"><Icon name="sparkle" size={11} />包厢</span>}
          {!compact && store.uploader && <span className="flex items-center gap-0.5"><Icon name="user" size={11} />{store.uploader.nickname || "匿名"}</span>}
        </div>
        {!compact && <p className="text-2xs text-paper-600">{formatRelativeTime(store.createdAt)}添加</p>}
      </div>
    </Card>
  );
});
