// 地图POI搜索 API — 支持高德/百度/腾讯

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getKeys() {
  return {
    amap: process.env.AMAP_WEB_KEY || "",
    baidu: process.env.BAIDU_MAP_AK || "",
    tencent: process.env.TENCENT_MAP_KEY || "",
  };
}

function buildUrl(provider: string, kw: string, city: string, key: string): string {
  switch (provider) {
    case "amap":
      return `https://restapi.amap.com/v5/place/text?keywords=${encodeURIComponent(kw)}&region=${encodeURIComponent(city || "全国")}&key=${key}&types=050000`;
    case "baidu":
      return `https://api.map.baidu.com/place/v2/search?query=${encodeURIComponent(kw)}&region=${encodeURIComponent(city || "全国")}&output=json&ak=${key}`;
    case "tencent":
      return `https://apis.map.qq.com/ws/place/v1/search?keyword=${encodeURIComponent(kw)}&boundary=region(${encodeURIComponent(city || "全国")},0)&key=${key}`;
    default:
      return "";
  }
}

function extractResults(provider: string, data: any): Array<{ name: string; address: string; longitude: number; latitude: number }> {
  const list = provider === "amap" ? data.pois : provider === "baidu" ? data.results : data.data;
  if (!list) return [];
  return list.slice(0, 10).map((poi: any) => {
    switch (provider) {
      case "amap":
        return {
          name: poi.name,
          address: poi.address || "",
          longitude: parseFloat(poi.location?.split(",")[0] || "0"),
          latitude: parseFloat(poi.location?.split(",")[1] || "0"),
        };
      case "baidu":
        return {
          name: poi.name,
          address: poi.address || "",
          longitude: poi.location?.lng || 0,
          latitude: poi.location?.lat || 0,
        };
      case "tencent":
        return {
          name: poi.title,
          address: poi.address || "",
          longitude: poi.location?.lng || 0,
          latitude: poi.location?.lat || 0,
        };
      default:
        return { name: "", address: "", longitude: 0, latitude: 0 };
    }
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword") || "";
    const city = searchParams.get("city") || "";
    const provider = searchParams.get("provider") || "amap";

    if (!keyword.trim()) {
      return NextResponse.json({ error: "请输入搜索关键词" }, { status: 400 });
    }

    // 每次请求时读取，确保 Vercel 环境变量生效
    const keys = getKeys();
    const key = keys[provider as keyof typeof keys];
    if (!key) {
      return NextResponse.json({
        error: `${provider} 地图 Key 未配置`,
        results: [],
      });
    }

    const url = buildUrl(provider, keyword.trim(), city, key);
    const res = await fetch(url);
    const data = await res.json();
    const results = extractResults(provider, data);

    return NextResponse.json({ results, provider });
  } catch {
    return NextResponse.json({ error: "搜索失败" }, { status: 500 });
  }
}
