"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils"; import { maskWechatId } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

const MENU = [
  { key: "home", label: "首页", icon: "home" as const, href: "/" },
  { key: "stores", label: "店铺", icon: "list" as const, href: "/stores" },
  { key: "rank", label: "排行", icon: "trophy" as const, href: "/rank" },
  { key: "random", label: "随机", icon: "dice" as const, href: "/random" },
  { key: "add", label: "上传", icon: "plus" as const, href: "/stores/new" },
  { key: "profile", label: "我的", icon: "user" as const, href: "/profile" },
];

export function Sidebar() {
  const pathname = usePathname(); const router = useRouter(); const { data: session } = useSession();
  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="hidden md:flex md:flex-col fixed left-0 top-0 bottom-0 w-60 bg-ink-950/90 ring-1 ring-ink-800/50 z-30 select-none">
      <div className="flex items-center gap-3 px-5 h-16 ring-1 ring-ink-800/30">
        <Icon name="plate" size={24} className="text-caramel-400" />
        <div>
          <h1 className="text-sm font-bold text-ink-50 tracking-wide">周日晚饭吃什么</h1>
          <p className="text-2xs text-ink-500 tracking-widest uppercase">THE SUNDAY TABLE</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {MENU.map((item) => {
          const isActive = active(item.href);
          return (
            <button key={item.key} onClick={() => router.push(item.href)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium tracking-wide transition-all duration-150",
                isActive ? "bg-caramel-500/10 text-caramel-400 ring-1 ring-caramel-500/20" : "text-ink-400 hover:text-ink-200 hover:bg-ink-900/50"
              )}
            >
              <Icon name={item.icon} size={16} />{item.label}
              {isActive && <span className="ml-auto w-1 h-1 bg-caramel-400" />}
            </button>
          );
        })}
        {session?.user?.role === "ADMIN" && (
          <>
            <div className="my-2 mx-3 h-px bg-ink-800" />
            <button onClick={() => router.push("/admin")}
              className={cn("w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium tracking-wide transition-all duration-150",
                active("/admin") ? "bg-caramel-500/10 text-caramel-400 ring-1 ring-caramel-500/20" : "text-ink-400 hover:text-ink-200 hover:bg-ink-900/50")}
            >
              <Icon name="gear" size={16} />管理
              {active("/admin") && <span className="ml-auto w-1 h-1 bg-caramel-400" />}
            </button>
          </>
        )}
      </nav>

      {session?.user && (
        <div className="px-4 py-3 ring-1 ring-ink-800/30 bg-ink-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-caramel-500/15 flex items-center justify-center text-caramel-400 font-bold text-xs ring-1 ring-caramel-500/20">
              {(session.user.name || "?")[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-200 truncate">{session.user.name || "用户"}</p>
              <p className="text-2xs text-ink-500">{maskWechatId(session.user.wechatId)}</p>
            </div>
            <button onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-ink-600 hover:text-rust-400 transition-colors p-1">
              <Icon name="logout" size={14} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
