"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { Tabs } from "@/components/ui/Tabs";
import { StoreCard } from "@/components/store/StoreCard";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { STORE_CATEGORIES } from "@/lib/constants";

function RankBadge({ rank }: { rank: number }) {
  const c = rank === 1 ? "text-caramel-400" : rank === 2 ? "text-ink-200" : rank === 3 ? "text-caramel-700" : "text-ink-500";
  return (
    <div className="flex items-center justify-center shrink-0" style={{ width: 28, height: 28 }}>
      {rank <= 3 ? <Icon name="medal" size={rank <= 3 ? 24 : 14} className={c} />
      : <span className="w-6 h-6 rounded-full bg-ink-800 flex items-center justify-center text-2xs font-bold text-ink-300 select-none">{rank}</span>}
    </div>
  );
}

function StoreRankList() {
  const [category, setCategory] = useState("");
  const key = useMemo(() => {
    const p = new URLSearchParams({ limit: "20" });
    if (category) p.set("category", category);
    return `/api/rank/stores?${p.toString()}`;
  }, [category]);
  const { data, isLoading } = useSWR(key);
  const stores = data?.stores || [];

  return <div className="space-y-3">
    <Select value={category} onChange={setCategory} options={STORE_CATEGORIES.map(c => ({ value: c.value, label: c.label }))} placeholder="全部分类" />
    {isLoading ? <div className="space-y-3"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
    : stores.length === 0 ? <EmptyState icon="trophy" title="暂无排行" description="还没有足够的评分数据" />
    : <div className="stagger space-y-2">{stores.map((s: any, i: number) => <div key={s.id} className="flex items-start gap-2.5"><div className="mt-4 shrink-0"><RankBadge rank={i+1} /></div><div className="flex-1"><StoreCard store={s} /></div></div>)}</div>}
  </div>;
}

function UserRankList() {
  const { data, isLoading } = useSWR("/api/rank/users?limit=20");
  const users = data?.users || [];

  return <div className="space-y-2">
    {isLoading ? <div className="space-y-2">{[1,2,3].map(i => <Card key={i}><div className="flex items-center gap-3 h-12"><div className="h-7 w-7 bg-ink-800 rounded-full animate-pulse" /><div className="flex-1 space-y-1"><div className="h-3 w-20 bg-ink-800 rounded animate-shimmer" /><div className="h-2 w-28 bg-ink-800 rounded animate-shimmer" /></div></div></Card>)}</div>
    : users.length === 0 ? <EmptyState icon="user" title="暂无排行" description="还没有用户贡献数据" />
    : <div className="stagger space-y-2">{users.map((u: any) => (
      <Card key={u.id}><div className="flex items-center gap-3">
        <RankBadge rank={u.rank} />
        <div className="w-9 h-9 rounded-xl bg-caramel-500/20 flex items-center justify-center text-caramel-400 font-semibold text-sm border border-caramel-500/20 select-none">{(u.nickname||"?")[0]}</div>
        <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-ink-100 truncate">{u.nickname}</p><p className="text-2xs text-ink-500">{u.storeCount} 家店铺 · {u.ratingCount} 次评分</p></div>
        <div className="text-right"><p className="text-lg font-bold text-caramel-400 tabular-nums">{u.contributionScore}</p><p className="text-2xs text-ink-500">贡献分</p></div>
      </div></Card>
    ))}</div>}
  </div>;
}

export default function RankPage() {
  const [tab, setTab] = useState("stores");
  return <div className="space-y-5 animate-fade-up">
    <div><p className="text-2xs tracking-[0.15em] uppercase text-caramel-400 font-semibold mb-1 select-none">Leaderboard</p><h2 className="text-xl font-bold text-ink-50 flex items-center gap-2"><Icon name="trophy" size={22} className="text-caramel-400" />排行榜</h2></div>
    <Tabs tabs={[{ key: "stores", label: "店铺排行" },{ key: "users", label: "贡献排行" }]} activeKey={tab} onChange={setTab} />
    {tab === "stores" ? <StoreRankList /> : <UserRankList />}
  </div>;
}
