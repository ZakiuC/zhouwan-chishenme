// 根布局

import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "周日晚饭吃什么",
  description: "解决群友周日晚上不知道吃什么的终极方案",
  appleWebApp: {
    title: "周日晚饭吃什么",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "周日晚饭吃什么",
    description: "解决群友周日晚上不知道吃什么的终极方案",
    type: "website",
  },
  other: {
    "mobile-web-app-capable": "yes",
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
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          *, *::before, *::after { cursor: default !important; }
          input, textarea, select, [contenteditable] { cursor: text !important; }
          a, button, [role="button"], [tabindex]:not([tabindex="-1"]) { cursor: pointer !important; }
        `}} />
      </head>
      <body>
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
