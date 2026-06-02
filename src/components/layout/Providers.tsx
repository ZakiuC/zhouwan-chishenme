"use client";

// 全局 Provider 包裹组件（SessionProvider 需要在客户端）

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
