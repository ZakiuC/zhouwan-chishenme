// SWR 全局配置 — 客户端数据获取自动去重

"use client";

import { SWRConfig } from "swr";

const swrConfig = {
  fetcher: (url: string) => fetch(url).then((res) => {
    if (!res.ok) throw new Error("请求失败");
    return res.json();
  }),
  revalidateOnFocus: false,
  dedupingInterval: 2000,
  errorRetryCount: 2,
  shouldRetryOnError: false,
};

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}
