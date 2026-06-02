"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/ui/Toast";

export default function WhitelistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newId, setNewId] = useState("");
  const [newNick, setNewNick] = useState("");
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  const refreshList = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      const res = await fetch(`/api/whitelist?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      refreshList();
    }
  }, [refreshList, session]);

  const handleAdd = async () => {
    if (!newId.trim()) {
      showToast("请输入微信号", "error");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wechatId: newId.trim(),
          nickname: newNick.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "添加失败");
      }
      showToast("添加成功", "success");
      setNewId("");
      setNewNick("");
      refreshList();
    } catch (err: any) {
      showToast(err.message || "添加失败", "error");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (wechatId: string) => {
    if (!confirm(`确定从白名单中删除 "${wechatId}" 吗？`)) return;
    try {
      const res = await fetch(`/api/whitelist?wechatId=${wechatId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "删除失败");
      }
      showToast("已删除", "success");
      refreshList();
    } catch (err: any) {
      showToast(err.message || "删除失败", "error");
    }
  };

  if (status === "loading") {
    return <div className="p-8 text-center text-paper-500">加载中...</div>;
  }
  if (session?.user?.role !== "ADMIN") return null;

  const registeredCount = entries.filter((e) => e.isUsed).length;

  return (
    <div className="space-y-4 animate-fade-up">
      <div>
        <p className="text-2xs tracking-[0.15em] uppercase text-accent-400 font-semibold mb-1 select-none">
          Admin
        </p>
        <h2 className="text-xl font-bold text-paper-100 flex items-center gap-2"><Icon name="list" size={20} className="text-accent-400" />白名单管理</h2>
      </div>

      {/* 添加 */}
      <Card>
        <div className="space-y-3">
          <h4 className="font-semibold text-paper-200 text-sm select-none">
            添加微信号
          </h4>
          <Input
            placeholder="微信号"
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
          />
          <Input
            placeholder="备注昵称（可选）"
            value={newNick}
            onChange={(e) => setNewNick(e.target.value)}
          />
          <Button className="w-full" onClick={handleAdd} loading={adding}>
            添加到白名单
          </Button>
        </div>
      </Card>

      {/* 列表 */}
      <Card>
        <div className="space-y-3">
          <Input
            placeholder="搜索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <p className="text-xs text-paper-500 select-none">
            共 {entries.length} 人（{registeredCount} 已注册）
          </p>

          {entries.length === 0 ? (
            <EmptyState
              icon="list"
              title="白名单为空"
              description="添加微信群成员的微信号"
            />
          ) : (
            <div className="space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between py-2 border-b border-base-500/20 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-paper-200">
                      {entry.wechatId}
                    </p>
                    {entry.nickname && (
                      <p className="text-2xs text-paper-500">{entry.nickname}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={entry.isUsed ? "sage" : "default"}>
                      {entry.isUsed ? "已注册" : "未注册"}
                    </Badge>
                    {!entry.isUsed && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(entry.wechatId)}
                      >
                        <Icon name="cross" size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
