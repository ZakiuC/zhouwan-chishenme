"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { maskWechatId } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

const MENU = [
  { key: "home", label: "首页", icon: "home" as const, href: "/" },
  { key: "stores", label: "店铺列表", icon: "list" as const, href: "/stores" },
  { key: "rank", label: "排行榜", icon: "trophy" as const, href: "/rank" },
  { key: "random", label: "随机推荐", icon: "dice" as const, href: "/random" },
  { key: "add", label: "上传店铺", icon: "plus" as const, href: "/stores/new" },
  { key: "profile", label: "个人中心", icon: "user" as const, href: "/profile" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="hidden md:flex md:flex-col fixed left-0 top-0 bottom-0 w-60 bg-base-800/95 backdrop-blur-xl border-r border-base-500/20 z-30 select-none">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-base-500/20">
        <Icon name="plate" size={28} className="text-accent-400" />
        <div>
          <h1 className="text-base font-bold text-paper-100">周日晚饭吃什么</h1>
          <p className="text-2xs text-paper-400 tracking-widest uppercase">The Sunday Table</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {MENU.map((item) => {
          const isActive = active(item.href);
          return (
            <button key={item.key} onClick={() => router.push(item.href)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent-500/15 text-accent-300 border border-accent-500/20"
                  : "text-paper-400 hover:text-paper-200 hover:bg-base-700/50"
              )}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-400" />}
            </button>
          );
        })}
      </nav>

      {session?.user && (
        <div className="px-4 py-3 border-t border-base-500/20 bg-base-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent-500/30 flex items-center justify-center text-accent-200 font-semibold text-sm border border-accent-500/20">
              {(session.user.name || "?")[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-paper-200 truncate">{session.user.name || "用户"}</p>
              <p className="text-2xs text-paper-500">{maskWechatId(session.user.wechatId)}</p>
            </div>
            <button onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-paper-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10">
              <Icon name="logout" size={16} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
