"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { StoreCard } from "@/components/store/StoreCard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { STORE_CATEGORIES, STORE_SORT_OPTIONS } from "@/lib/constants";
import Link from "next/link";

function buildParams(q: string, category: string, sort: string, page: number) {
  const p = new URLSearchParams();
  if (q) p.set("q", q);
  if (category) p.set("category", category);
  p.set("sort", sort);
  p.set("page", String(page));
  return p.toString();
}

export default function StoresPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "compositeScore";
  const page = parseInt(searchParams.get("page") || "1");

  const update = useCallback((updates: Record<string, string>) => {
    const p = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => v ? p.set(k, v) : p.delete(k));
    if (!("page" in updates)) p.set("page", "1");
    router.push(`/stores?${p.toString()}`);
  }, [searchParams, router]);

  const key = `/api/stores?${buildParams(q, category, sort, page)}`;
  const { data, isLoading } = useSWR(key);

  const stores = data?.stores || [];
  const pagination = data?.pagination || { page: 1, total: 0, totalPages: 0 };

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xs tracking-[0.15em] uppercase text-caramel-400 font-semibold mb-1 select-none">Browse</p>
          <h2 className="text-xl font-bold text-ink-50 flex items-center gap-2"><Icon name="list" size={20} className="text-caramel-400" />店铺列表</h2>
        </div>
        <Link href="/stores/new"><Button size="sm" variant="secondary"><Icon name="plus" size={14} className="mr-1" />上传</Button></Link>
      </div>
      <div className="space-y-2">
        <Input placeholder="搜索店铺名称..." value={q} onChange={e => update({ q: e.target.value })} />
        <div className="flex gap-2">
          <Select value={category} onChange={v => update({ category: v })} options={STORE_CATEGORIES.map(c => ({ value: c.value, label: c.label }))} placeholder="全部分类" className="flex-1" />
          <Select value={sort} onChange={v => update({ sort: v })} options={STORE_SORT_OPTIONS.map(s => ({ value: s.value, label: s.label }))} className="flex-1" />
        </div>
      </div>
      {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
      : stores.length === 0 ? <EmptyState icon="search" title="没有找到店铺" description={q ? `没有"${q}"的搜索结果` : "还没有人上传店铺"} action={!q ? <Link href="/stores/new"><Button>上传店铺</Button></Link> : undefined} />
      : <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger">{stores.map((s: any) => <StoreCard key={s.id} store={s} />)}</div>
        {pagination.totalPages > 1 && <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => update({ page: String(page - 1) })}>上一页</Button>
          <span className="text-sm text-ink-300 font-medium tabular-nums">{page} / {pagination.totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => update({ page: String(page + 1) })}>下一页</Button>
        </div>}
      </>}
      <p className="text-2xs text-ink-500 text-center select-none">共 {pagination.total} 家店铺</p>
    </div>
  );
}
