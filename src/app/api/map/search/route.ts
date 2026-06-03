// 地图POI搜索 API — 支持高德/百度/腾讯

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PROVIDERS = {
  amap: {
    key: process.env.AMAP_WEB_KEY || "",
    url: "https://restapi.amap.com/v5/place/text",
    build: (kw: string, city: string, key: string) =>
      `https://restapi.amap.com/v5/place/text?keywords=${encodeURIComponent(kw)}&region=${encodeURIComponent(city || "全国")}&key=${key}&types=050000`,
    map: (poi: any) => ({
      name: poi.name,
      address: poi.address || "",
      longitude: parseFloat(poi.location?.split(",")[0] || "0"),
      latitude: parseFloat(poi.location?.split(",")[1] || "0"),
    }),
    extract: (d: any) => d.pois || [],
  },
  baidu: {
    key: process.env.BAIDU_MAP_AK || "",
    url: "https://api.map.baidu.com/place/v2/search",
    build: (kw: string, city: string, key: string) =>
      `https://api.map.baidu.com/place/v2/search?query=${encodeURIComponent(kw)}&region=${encodeURIComponent(city || "全国")}&output=json&ak=${key}`,
    map: (poi: any) => ({
      name: poi.name,
      address: poi.address || "",
      longitude: poi.location?.lng || 0,
      latitude: poi.location?.lat || 0,
    }),
    extract: (d: any) => d.results || [],
  },
  tencent: {
    key: process.env.TENCENT_MAP_KEY || "",
    url: "https://apis.map.qq.com/ws/place/v1/search",
    build: (kw: string, city: string, key: string) =>
      `https://apis.map.qq.com/ws/place/v1/search?keyword=${encodeURIComponent(kw)}&boundary=region(${encodeURIComponent(city || "全国")},0)&key=${key}`,
    map: (poi: any) => ({
      name: poi.title,
      address: poi.address || "",
      longitude: poi.location?.lng || 0,
      latitude: poi.location?.lat || 0,
    }),
    extract: (d: any) => d.data || [],
  },
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword") || "";
    const city = searchParams.get("city") || "";
    const provider = (searchParams.get("provider") || "amap") as keyof typeof PROVIDERS;

    if (!keyword.trim()) {
      return NextResponse.json({ error: "请输入搜索关键词" }, { status: 400 });
    }

    const cfg = PROVIDERS[provider];
    if (!cfg || !cfg.key) {
      return NextResponse.json({
        error: `${provider} 地图 Key 未配置，请在 .env 中设置`,
        results: [],
      });
    }

    const url = cfg.build(keyword.trim(), city, cfg.key);
    const res = await fetch(url);
    const data = await res.json();

    const pois = cfg.extract(data);
    const results = pois.slice(0, 10).map(cfg.map);

    return NextResponse.json({ results, provider });
  } catch {
    return NextResponse.json({ error: "搜索失败" }, { status: 500 });
  }
}
