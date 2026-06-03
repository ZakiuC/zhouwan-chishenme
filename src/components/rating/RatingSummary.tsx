"use client";

import dynamic from "next/dynamic";
import { RatingBar } from "./RatingBar";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";

// 雷达图按需加载，减少首屏 JS
const RatingRadarChart = dynamic(
  () => import("./RatingRadarChart").then((m) => m.RatingRadarChart),
  { ssr: false, loading: () => <div className="h-[280px] flex items-center justify-center"><div className="w-56 h-56 rounded-full bg-base-700/50 animate-pulse" /></div> }
);

interface Props { store: { avgWantScore: number; avgTasteScore: number; avgValueScore: number; avgAmbienceScore: number; avgSpeedScore: number; compositeScore: number; ratingCount: number; recommendCount: number; notRecommendCount: number; }; }

export function RatingSummary({ store }: Props) {
  const triedScore = store.ratingCount > 0 ? (store.recommendCount / store.ratingCount) * 5 : 0;
  const radarData: Record<string, number> = { want: store.avgWantScore, tried: triedScore, taste: store.avgTasteScore, value: store.avgValueScore, ambience: store.avgAmbienceScore, speed: store.avgSpeedScore };
  const bars = [
    { key: "avgWantScore", label: "想吃指数", score: store.avgWantScore },
    { key: "avgTasteScore", label: "口味", score: store.avgTasteScore },
    { key: "avgValueScore", label: "性价比", score: store.avgValueScore },
    { key: "avgAmbienceScore", label: "环境氛围", score: store.avgAmbienceScore },
    { key: "avgSpeedScore", label: "上菜速度", score: store.avgSpeedScore },
  ];

  return (
    <Card glow={store.compositeScore > 3.5}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 select-none"><Icon name="chart" size={18} className="text-accent-400" /><h3 className="font-semibold text-paper-200">评分总览</h3></div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gold-400 tabular-nums">{store.compositeScore.toFixed(1)}</p>
          <p className="text-2xs text-paper-500">{store.ratingCount} 人评分</p>
        </div>
      </div>
      {store.ratingCount > 0 && <div className="mb-4 flex justify-center"><RatingRadarChart data={radarData} size={280} /></div>}
      <div className="space-y-2.5 bg-base-800/60 rounded-xl p-3">
        {bars.map(b => <RatingBar key={b.key} label={b.label} score={b.score} />)}
      </div>
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-base-500/30">
        <div className="text-center flex-1"><p className="text-lg font-bold text-emerald-400">{store.recommendCount}</p><p className="text-2xs text-paper-500 flex items-center justify-center gap-1"><Icon name="thumbs-up" size={10} />推荐</p></div>
        <div className="w-px h-8 bg-base-500/30" />
        <div className="text-center flex-1"><p className="text-lg font-bold text-red-400">{store.notRecommendCount}</p><p className="text-2xs text-paper-500 flex items-center justify-center gap-1"><Icon name="cross" size={10} />不推荐</p></div>
      </div>
    </Card>
  );
}
