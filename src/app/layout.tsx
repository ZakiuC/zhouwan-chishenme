// 根布局

import type { Metadata } from "next";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

import type { Viewport } from "next";

export const metadata: Metadata = {
  title: "周日晚饭吃什么",
  description: "解决群友周日晚上不知道吃什么的终极方案",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "周日晚饭吃什么",
  },
  openGraph: {
    title: "周日晚饭吃什么",
    description: "解决群友周日晚上不知道吃什么的终极方案",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FF6B35",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
