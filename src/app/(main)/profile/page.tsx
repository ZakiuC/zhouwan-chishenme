"use client";

import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { StoreCard } from "@/components/store/StoreCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { maskWechatId } from "@/lib/utils";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  const { data: storesData, isLoading: storesLoading } = useSWR(
    session ? "/api/stores?sort=createdAt&limit=100" : null
  );
  const { data: ratingsData, isLoading: ratingsLoading } = useSWR(
    session ? "/api/ratings?limit=100" : null
  );

  const stores = (storesData?.stores || []).filter(
    (s: any) => s.uploader?.nickname === session?.user?.name
  );
  const ratings = ratingsData?.ratings || [];
  const tried = ratings.filter((r: any) => r.triedRating !== "NOT_TRIED").length;
  const loading = storesLoading || ratingsLoading;

  return <div className="space-y-5 animate-fade-up">
    <Card glow className="border-accent-500/20">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-accent-500/20 flex items-center justify-center text-accent-200 font-bold text-2xl border border-accent-500/20 shadow-glow select-none">{(session?.user?.name || "?")[0]}</div>
        <div className="flex-1"><h2 className="text-lg font-bold text-paper-50">{session?.user?.name || "用户"}</h2><p className="text-xs text-paper-500">{maskWechatId(session?.user?.wechatId || "")}</p></div>
        <Link href="/profile/settings"><Button variant="ghost" size="sm"><Icon name="gear" size={18} /></Button></Link>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-base-500/20">
        <div className="text-center"><p className="text-xl font-bold text-accent-300 tabular-nums">{stores.length}</p><p className="text-2xs text-paper-500 select-none">上传店铺</p></div>
        <div className="text-center"><p className="text-xl font-bold text-sage-300 tabular-nums">{ratings.length}</p><p className="text-2xs text-paper-500 select-none">评价次数</p></div>
        <div className="text-center"><p className="text-xl font-bold text-gold-400 tabular-nums">{tried}</p><p className="text-2xs text-paper-500 select-none">吃过评价</p></div>
      </div>
    </Card>

    {loading ? <div className="space-y-3"><CardSkeleton /><CardSkeleton /></div> : <>
      <section>
        <div className="flex items-center justify-between mb-2"><h3 className="font-semibold text-paper-200 text-sm select-none flex items-center gap-1"><Icon name="pencil" size={14} />我上传的店铺</h3><Link href="/stores/new"><Button variant="outline" size="sm"><Icon name="plus" size={12} className="mr-1" />新增</Button></Link></div>
        {stores.length === 0 ? <Card><EmptyState icon="pencil" title="还没有上传店铺" description="分享你推荐的店铺吧" /></Card>
        : <div className="grid grid-cols-1 md:grid-cols-2 gap-2">{stores.map((s: any) => <StoreCard key={s.id} store={s} compact />)}</div>}
      </section>
      <section>
        <h3 className="font-semibold text-paper-200 text-sm mb-2 select-none flex items-center gap-1"><Icon name="star" size={14} className="text-gold-400" />我评过的店</h3>
        {ratings.length === 0 ? <Card><EmptyState icon="star" title="还没有评分" description="去给店铺打分吧" /></Card>
        : <div className="space-y-2">{ratings.slice(0, 10).map((r: any) => <Link key={r.id} href={`/stores/${r.store?.id}`} className="block"><Card padding="sm" className="hover:border-accent-500/30"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-paper-200">{r.store?.name || "未知"}</p><div className="flex items-center gap-1.5 mt-0.5"><Icon name="star" size={12} className="text-gold-400" /><span className="text-2xs text-paper-500">想吃 {r.wantScore}/5</span></div></div><Icon name="arrow-right" size={14} className="text-paper-600" /></div></Card></Link>)}</div>}
      </section>
    </>}
    <Button variant="ghost" className="w-full text-paper-500 hover:text-red-400" onClick={() => signOut({ callbackUrl: "/login" })}>
      <Icon name="logout" size={14} className="mr-1" />退出登录
    </Button>
  </div>;
}
