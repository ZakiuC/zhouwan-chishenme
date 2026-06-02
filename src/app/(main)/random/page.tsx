"use client";

import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Select } from "@/components/ui/Select";
import { MapLinkButton } from "@/components/store/MapLinkButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { STORE_CATEGORIES } from "@/lib/constants";
import Link from "next/link";

const HK = "random_history";
function getH(): string[] { if (typeof window === "undefined") return []; try { return JSON.parse(localStorage.getItem(HK) || "[]"); } catch { return []; } }
function addH(id: string) { const h = getH(); localStorage.setItem(HK, JSON.stringify([id, ...h.filter(x => x !== id)].slice(0, 5))); }

const FETCHER = (url: string) => fetch(url).then(r => { if (!r.ok) throw new Error(""); return r.json(); });

export default function RandomPage() {
  const [rolling, setRolling] = useState(false);
  const [category, setCategory] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [url, setUrl] = useState("");

  useEffect(() => { setHistory(getH()); }, []);

  const { data, isValidating, mutate } = useSWR(url, FETCHER, { revalidateOnFocus: false, dedupingInterval: 0 });

  const fetchR = useCallback(async () => {
    setRolling(true);
    const ex = getH();
    const p = new URLSearchParams();
    if (category) p.set("category", category);
    if (ex.length) p.set("exclude", ex.join(","));
    const newUrl = `/api/random?${p.toString()}`;

    // 延迟一下给动画时间
    await new Promise(r => setTimeout(r, 1500));

    try {
      const res = await fetch(newUrl);
      if (!res.ok) throw new Error("");
      const d = await res.json();
      addH(d.store.id);
      setHistory(getH());
      mutate(d, false);
    } catch {
      mutate({ store: null }, false);
    } finally {
      setRolling(false);
    }
  }, [category, mutate]);

  useEffect(() => { fetchR(); }, []); // eslint-disable-line

  const store = data?.store;

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="text-center select-none">
        <p className="text-2xs tracking-[0.15em] uppercase text-accent-400 font-semibold mb-1">Lucky Draw</p>
        <h2 className="text-xl font-bold text-paper-100 flex items-center justify-center gap-2"><Icon name="dice" size={22} className="text-accent-400" />随机推荐</h2>
        <p className="text-sm text-paper-500 mt-1">让命运决定今晚吃什么</p>
      </div>

      <div className="flex gap-2">
        <div className="flex-1"><Select value={category} onChange={setCategory} options={STORE_CATEGORIES.map(c => ({ value: c.value, label: c.label }))} placeholder="全部分类" /></div>
        <Button onClick={fetchR} loading={rolling} variant={rolling ? "outline" : "primary"}>{rolling ? "挑选中..." : <><Icon name="dice" size={14} className="mr-1" />换一个</>}</Button>
      </div>

      {rolling && <Card><div className="py-16 flex flex-col items-center justify-center select-none">
        <Icon name="dice" size={48} className="text-accent-400 animate-float mb-4" />
        <p className="text-sm text-paper-500 animate-pulse">正在为你挑选...</p>
      </div></Card>}

      {!rolling && store && <div className="animate-scale-in space-y-4">
        <Card glow className="border-accent-500/30">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xs text-accent-400 font-semibold tracking-wider mb-1 select-none flex items-center gap-1"><Icon name="sparkle" size={10} className="text-accent-400" />今日推荐</p>
                <h3 className="text-xl font-bold text-paper-50">{store.name}</h3>
                {store.address && <p className="text-sm text-paper-500 mt-1 flex items-center gap-1"><Icon name="map-pin" size={12} />{store.address}</p>}
              </div>
              <Badge variant="accent">{STORE_CATEGORIES.find((c: any) => c.value === store.category)?.label || "其他"}</Badge>
            </div>
            {store.description && <p className="text-sm text-paper-300 leading-relaxed">{store.description}</p>}
            <div className="flex items-center gap-3 text-sm py-3 border-y border-base-500/20">
              <Icon name="star" size={16} className="text-gold-400" />
              <span className="text-paper-300 font-medium">{(store.compositeScore || store.avgWantScore).toFixed(1)}</span>
              <span className="text-base-400">|</span><span className="text-paper-400 text-xs">{store.ratingCount} 人评分</span>
              <span className="text-base-400">|</span><span className="text-emerald-400 text-xs flex items-center gap-0.5"><Icon name="thumbs-up" size={11} />{store.recommendCount}</span>
            </div>
            {store.mapLinks?.length > 0 && <div><p className="text-xs text-paper-500 mb-2 select-none flex items-center gap-1"><Icon name="phone" size={12} />快速导航</p><div className="grid grid-cols-3 gap-2">{store.mapLinks.map((ml: any) => <MapLinkButton key={ml.id} provider={ml.provider} url={ml.url} name={store.name} longitude={ml.longitude} latitude={ml.latitude} />)}</div></div>}
            <div className="flex gap-3"><Link href={`/stores/${store.id}`} className="flex-1"><Button variant="outline" className="w-full">查看详情</Button></Link><Button className="flex-1" onClick={fetchR}><Icon name="dice" size={14} className="mr-1" />再换一个</Button></div>
          </div>
        </Card>
        {history.length > 1 && <div className="flex items-center gap-2 justify-center select-none"><span className="text-2xs text-paper-600">最近推荐（自动跳过）：</span>{history.slice(1, 4).map((_, i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-base-500" />)}</div>}
      </div>}

      {!rolling && !store && <EmptyState icon="search" title="暂无推荐" description={category ? "该分类下店铺不足" : "还没有店铺"} action={<Link href="/stores/new"><Button>上传店铺</Button></Link>} />}
    </div>
  );
}
