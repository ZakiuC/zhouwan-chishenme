"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

const NAV = [
  { key: "home", label: "首页", icon: "home" as const, href: "/" },
  { key: "rank", label: "排行", icon: "trophy" as const, href: "/rank" },
  { key: "add", label: "上传", icon: "plus" as const, href: "/stores/new", hl: true },
  { key: "random", label: "随机", icon: "dice" as const, href: "/random" },
  { key: "profile", label: "我的", icon: "user" as const, href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const active = (h: string) => h === "/" ? pathname === "/" : pathname.startsWith(h);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-base-800/95 backdrop-blur-xl border-t border-base-500/20 safe-bottom select-none">
      <div className="flex items-center justify-around h-[62px] max-w-lg mx-auto">
        {NAV.map((item) => {
          const isActive = active(item.href);
          return (
            <button key={item.key} onClick={() => router.push(item.href)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 px-2 transition-all duration-200 relative",
                isActive ? "text-accent-300" : "text-paper-500 hover:text-paper-300"
              )}
            >
              {item.hl && (
                <div className={cn(
                  "absolute -top-3 flex items-center justify-center w-12 h-12 rounded-2xl shadow-lg transition-all duration-200",
                  "bg-accent-500 text-white shadow-accent-500/30",
                  "hover:shadow-accent-500/40 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                )}>
                  <Icon name={item.icon} size={20} />
                </div>
              )}
              {!item.hl && <Icon name={item.icon} size={20} />}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
