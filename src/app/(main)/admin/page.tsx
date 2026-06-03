"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") return <div className="p-8 text-center text-paper-500">加载中...</div>;
  if (session?.user?.role !== "ADMIN") return null;

  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <p className="text-2xs tracking-[0.15em] uppercase text-accent-400 font-semibold mb-1 select-none">Admin</p>
        <h2 className="text-xl font-bold text-paper-100 flex items-center gap-2"><Icon name="gear" size={22} className="text-accent-400" />系统管理</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/whitelist">
          <Card className="hover:border-accent-500/30 cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent-500/15 flex items-center justify-center border border-accent-500/20">
                <Icon name="list" size={24} className="text-accent-400" />
              </div>
              <div>
                <h3 className="font-semibold text-paper-100">白名单管理</h3>
                <p className="text-xs text-paper-400 mt-0.5">管理群友微信号</p>
              </div>
              <Icon name="arrow-right" size={16} className="ml-auto text-paper-600" />
            </div>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="hover:border-accent-500/30 cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/15 flex items-center justify-center border border-gold-500/20">
                <Icon name="user" size={24} className="text-gold-400" />
              </div>
              <div>
                <h3 className="font-semibold text-paper-100">用户管理</h3>
                <p className="text-xs text-paper-400 mt-0.5">封禁/删除用户</p>
              </div>
              <Icon name="arrow-right" size={16} className="ml-auto text-paper-600" />
            </div>
          </Card>
        </Link>

        <Link href="/admin/stores">
          <Card className="hover:border-accent-500/30 cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sage-500/15 flex items-center justify-center border border-sage-500/20">
                <Icon name="edit" size={24} className="text-sage-400" />
              </div>
              <div>
                <h3 className="font-semibold text-paper-100">店铺管理</h3>
                <p className="text-xs text-paper-400 mt-0.5">关闭/删除店铺</p>
              </div>
              <Icon name="arrow-right" size={16} className="ml-auto text-paper-600" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
