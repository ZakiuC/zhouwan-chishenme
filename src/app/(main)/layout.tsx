// 主应用布局 — 认证守卫 + SWR + 响应式导航

import { AuthGuard } from "@/components/layout/AuthGuard";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { SWRProvider } from "@/components/layout/SWRProvider";
import { ToastProvider } from "@/components/ui/Toast";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SWRProvider>
        <ToastProvider>
          <ResponsiveLayout>{children}</ResponsiveLayout>
        </ToastProvider>
      </SWRProvider>
    </AuthGuard>
  );
}
