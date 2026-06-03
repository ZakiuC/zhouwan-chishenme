"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/ui/Toast";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { maskWechatId, formatRelativeTime } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "", label: "全部状态" },
  { value: "ACTIVE", label: "正常" },
  { value: "BANNED", label: "已封禁" },
];

export default function AdminUsersPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (authStatus === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, authStatus, router]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (statusFilter) p.set("status", statusFilter);
      const res = await fetch(`/api/admin/users?${p.toString()}`);
      if (!res.ok) throw new Error("无权限");
      const d = await res.json();
      setUsers(d.users || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleAction = async (userId: string, action: string, confirmMsg?: string) => {
    if (confirmMsg && !confirm(confirmMsg)) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      const labels: Record<string, string> = {
        ban: "已封禁", unban: "已解封", "clear-password": "密码已清除", delete: "已删除",
      };
      showToast(labels[action] || "操作成功", "success");
      fetchUsers();
    } catch (err: any) { showToast(err.message || "操作失败", "error"); }
  };

  if (authStatus === "loading") return <div className="p-8 text-center text-ink-500">加载中...</div>;
  if (session?.user?.role !== "ADMIN") return null;

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xs tracking-[0.15em] uppercase text-caramel-400 font-semibold mb-1 select-none">
            <a href="/admin" className="hover:text-caramel-400">Admin</a> / Users
          </p>
          <h2 className="text-xl font-bold text-ink-50 flex items-center gap-2"><Icon name="user" size={20} className="text-caramel-400" />用户管理</h2>
        </div>
      </div>

      <Select value={statusFilter} onChange={setStatusFilter}
        options={STATUS_OPTIONS} className="w-32" />

      <p className="text-xs text-ink-500 select-none">共 {users.length} 个用户</p>

      {loading ? (
        <div className="space-y-2"><CardSkeleton /><CardSkeleton /></div>
      ) : users.length === 0 ? (
        <EmptyState icon="user" title="没有用户" description="还没有用户注册" />
      ) : (
        <div className="space-y-2">
          {users.map((user) => (
            <Card key={user.id} padding="md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-ink-50 text-sm">{user.nickname || user.wechatId}</h4>
                    <span className="text-2xs text-ink-500">{maskWechatId(user.wechatId)}</span>
                    <Badge variant={user.role === "ADMIN" ? "gold" : "default"} size="sm">
                      {user.role === "ADMIN" ? "管理员" : "用户"}
                    </Badge>
                    <Badge variant={user.status === "BANNED" ? "danger" : "sage"} size="sm">
                      {user.status === "BANNED" ? "已封禁" : "正常"}
                    </Badge>
                    <Badge variant={user.hasPassword ? "accent" : "default"} size="sm">
                      {user.hasPassword ? "有密码" : "无密码"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-2xs text-ink-500">
                    <span>{user._count?.stores || 0} 家店铺</span>
                    <span>{user._count?.ratings || 0} 次评分</span>
                    <span>{formatRelativeTime(user.createdAt)}加入</span>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {user.status === "BANNED" ? (
                    <Button variant="secondary" size="sm" onClick={() => handleAction(user.id, "unban")}>解封</Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleAction(user.id, "ban")}>封禁</Button>
                  )}
                  {user.hasPassword && (
                    <Button variant="ghost" size="sm" onClick={() => handleAction(user.id, "clear-password", `确定清除 ${user.nickname || user.wechatId} 的密码？`)}>
                      清密
                    </Button>
                  )}
                  {user.role !== "ADMIN" && (
                    <Button variant="danger" size="sm" onClick={() => handleAction(user.id, "delete", `确定永久删除 ${user.nickname || user.wechatId} ？`)}>
                      删除
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
