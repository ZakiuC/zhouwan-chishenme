"use client";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

interface MapLinkButtonProps {
  provider: string; url: string; name: string;
  longitude?: number | null; latitude?: number | null;
}

const PROVIDER_STYLES: Record<string, { bg: string; label: string }> = {
  AMAP: { bg: "bg-[#1677FF] hover:bg-[#1677FF]/90", label: "高德" },
  BAIDU: { bg: "bg-[#DE3824] hover:bg-[#DE3824]/90", label: "百度" },
  TENCENT: { bg: "bg-[#07C160] hover:bg-[#07C160]/90", label: "腾讯" },
};

function buildUrl(provider: string, url: string, name: string, lon?: number | null, lat?: number | null): string {
  if (lon != null && lat != null) {
    switch (provider) {
      case "AMAP": return `https://uri.amap.com/marker?position=${lon},${lat}&name=${encodeURIComponent(name)}`;
      case "BAIDU": return `https://api.map.baidu.com/marker?location=${lat},${lon}&title=${encodeURIComponent(name)}&content=${encodeURIComponent(name)}&output=html`;
      case "TENCENT": return `https://apis.map.qq.com/uri/v1/marker?marker=coord:${lat},${lon};title:${encodeURIComponent(name)}`;
    }
  }
  return url;
}

export function MapLinkButton({ provider, url, name, longitude, latitude }: MapLinkButtonProps) {
  const style = PROVIDER_STYLES[provider] || { bg: "bg-base-500", label: "地图" };
  const jumpUrl = buildUrl(provider, url, name, longitude, latitude);

  const handleClick = () => {
    const ua = navigator.userAgent.toLowerCase();
    const isWechat = ua.includes("micromessenger");
    const isMobile = /android|iphone|ipad|ipod/.test(ua);
    if (isWechat) {
      if (navigator.clipboard) { navigator.clipboard.writeText(jumpUrl).then(() => alert(`已复制${style.label}地图链接，请在浏览器中打开`)); }
      return;
    }
    if (isMobile) { window.location.href = jumpUrl; }
    else { window.open(jumpUrl, "_blank", "noopener,noreferrer"); }
  };

  return (
    <button onClick={handleClick}
      className={cn("flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-xl text-white text-2xs font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 select-none", style.bg)}>
      <Icon name="map-pin" size={16} />
      {style.label}
    </button>
  );
}
