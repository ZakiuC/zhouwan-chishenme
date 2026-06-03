"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

interface AuthGuardProps { children: ReactNode; }

export function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (status === "unauthenticated" && !isLoginPage) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [status, isLoginPage, pathname, router]);

  if (isLoginPage) return <>{children}</>;

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <div className="animate-pulse space-y-4 w-full max-w-md px-4">
          <div className="h-48 bg-ink-900/50 rounded-3xl" />
          <div className="h-32 bg-ink-900/50 rounded-2xl" />
          <div className="h-32 bg-ink-900/50 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <div className="text-center">
          <Icon name="alert" size={48} className="text-ink-500 mx-auto mb-4" />
          <p className="text-ink-300">请先登录</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
