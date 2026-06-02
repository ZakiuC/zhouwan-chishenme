"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { RatingSummary } from "@/components/rating/RatingSummary";
import { RatingForm } from "@/components/rating/RatingForm";
import { MapLinkButton } from "@/components/store/MapLinkButton";
import { DetailSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { STORE_CATEGORIES, TRIED_RATINGS } from "@/lib/constants";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";

function catLabel(v: string | null): string { if (!v) return "其他"; return STORE_CATEGORIES.find(c => c.value === v)?.label || "其他"; }
function triedLabel(v: string): string { return TRIED_RATINGS.find(r => r.value === v)?.label || v; }

export default function StoreDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const { data, isLoading, error, mutate } = useSWR(`/api/stores/${params.id}`);

  const store = data?.store;
  const myRating = data?.myRating;

  const onRatingSuccess = useCallback(() => { mutate(); }, [mutate]);

  if (isLoading) return <DetailSkeleton />;
  if (error || !store) return <EmptyState icon="alert" title="店铺不存在" description={error?.message} />;

  const isOwner = session?.user?.id === store.uploader?.id;

  return (
    <div className="space-y-5 pb-4 animate-fade-up">
      <Card className="border-accent-500/20">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-2xs tracking-[0.15em] uppercase text-accent-400 font-semibold mb-1 select-none">{catLabel(store.category)}</p>
              <h2 className="text-xl font-bold text-paper-50">{store.name}</h2>
              {store.address && <p className="text-sm text-paper-500 mt-1 flex items-center gap-1"><Icon name="map-pin" size={14} />{store.address}</p>}
            </div>
            <Badge variant="accent" size="md">{catLabel(store.category)}</Badge>
          </div>
          {store.description && <p className="text-sm text-paper-300 leading-relaxed pl-3 border-l-2 border-accent-500/30">{store.description}</p>}
          <div className="flex items-center gap-3 text-2xs text-paper-500 pt-2 border-t border-base-500/20">
            <span className="flex items-center gap-1"><Icon name="user" size={12} />{store.uploader?.nickname || "匿名"}</span>
            <span className="flex items-center gap-1"><Icon name="clock" size={12} />{formatDate(store.createdAt)}</span>
          </div>
          {isOwner && <div className="pt-1"><Link href={`/stores/edit/${store.id}`}><Button variant="outline" size="sm"><Icon name="edit" size={14} className="mr-1" />编辑</Button></Link></div>}
        </div>
      </Card>

      {store.mapLinks?.length > 0 && <Card>
        <div className="flex items-center gap-2 mb-3 select-none"><Icon name="map-pin" size={18} className="text-accent-400" /><h4 className="font-semibold text-paper-200 text-sm">地图导航</h4></div>
        <div className="grid grid-cols-3 gap-2">{store.mapLinks.map((ml: any) => <MapLinkButton key={ml.id} provider={ml.provider} url={ml.url} name={store.name} longitude={ml.longitude} latitude={ml.latitude} />)}</div>
        <p className="text-2xs text-paper-600 mt-2 text-center select-none">移动端点击跳转地图 APP</p>
      </Card>}

      <RatingSummary store={store} />
      <RatingForm storeId={store.id} existingRating={myRating} onSuccess={onRatingSuccess} />

      {store.ratings?.length > 0 && (
        <div className="space-y-3 stagger">
          <div className="flex items-center gap-2 px-1 select-none"><Icon name="chat" size={18} className="text-accent-400" /><h4 className="font-semibold text-paper-200 text-sm">大家的评价</h4><span className="text-xs text-paper-500">({store._count?.ratings || store.ratings.length})</span></div>
          {store.ratings.map((rating: any) => (
            <Card key={rating.id} padding="md">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-300 font-semibold text-xs select-none">{(rating.user?.nickname || "?")[0]}</div>
                    <span className="text-sm font-medium text-paper-200">{rating.user?.nickname || "匿名"}</span>
                  </div>
                  <Badge variant={rating.triedRating === "STRONGLY_RECOMMEND" ? "sage" : rating.triedRating === "NOT_RECOMMEND" ? "danger" : "default"}>{triedLabel(rating.triedRating)}</Badge>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="flex gap-0.5">{[...Array(rating.wantScore)].map((_,j) => <Icon key={j} name="star" size={14} className="text-gold-400" />)}</span>
                  <span className="text-paper-500 text-xs ml-1">想吃指数</span>
                </div>
                {rating.triedRating !== "NOT_TRIED" && <div className="grid grid-cols-4 gap-1 text-2xs text-paper-400 bg-base-800/60 rounded-lg p-2">
                  <span>口味 {rating.tasteScore}</span><span>性价比 {rating.valueScore}</span><span>环境 {rating.ambienceScore}</span><span>速度 {rating.speedScore}</span>
                </div>}
                {rating.comment && <p className="text-sm text-paper-300 bg-base-800/40 rounded-lg p-2.5 leading-relaxed italic">{rating.comment}</p>}
                <p className="text-2xs text-paper-600">{formatRelativeTime(rating.updatedAt || rating.createdAt)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
      {(!store.ratings || store.ratings.length === 0) && <Card><EmptyState icon="chat" title="还没有人评分" description="成为第一个给这家店评分的人吧" /></Card>}
    </div>
  );
}
