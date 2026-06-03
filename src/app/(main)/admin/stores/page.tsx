"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/ui/Toast";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { STORE_CATEGORIES } from "@/lib/constants";
import { formatRelativeTime } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "", label: "全部状态" },
  { value: "ACTIVE", label: "正常" },
  { value: "CLOSED", label: "已关闭" },
  { value: "DELETED", label: "已删除" },
];

function catLabel(v: string | null): string { if (!v) return "其他"; return STORE_CATEGORIES.find(c => c.value === v)?.label || "其他"; }

export default function AdminStoresPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (authStatus === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, authStatus, router]);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (q) p.set("q", q);
      if (statusFilter) p.set("status", statusFilter);
      p.set("page", String(page));
      const res = await fetch(`/api/admin/stores?${p.toString()}`);
      if (!res.ok) throw new Error("无权限");
      const d = await res.json();
      setStores(d.stores || []);
      setTotal(d.total);
      setTotalPages(d.totalPages);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [q, statusFilter, page]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const updateStatus = async (storeId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/stores", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, status: newStatus }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      showToast(newStatus === "ACTIVE" ? "已恢复" : newStatus === "DELETED" ? "已删除" : "已更新", "success");
      fetchStores();
    } catch (err: any) { showToast(err.message || "操作失败", "error"); }
  };

  if (authStatus === "loading") return <div className="p-8 text-center text-ink-500">加载中...</div>;
  if (session?.user?.role !== "ADMIN") return null;

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xs tracking-[0.15em] uppercase text-caramel-400 font-semibold mb-1 select-none">
            <a href="/admin" className="hover:text-caramel-400">Admin</a> / Stores
          </p>
          <h2 className="text-xl font-bold text-ink-50 flex items-center gap-2"><Icon name="edit" size={20} className="text-caramel-400" />店铺管理</h2>
        </div>
      </div>

      <div className="flex gap-2">
        <Input placeholder="搜索店铺..." value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
        <Select value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1); }}
          options={STATUS_OPTIONS} className="w-32" />
      </div>

      <p className="text-xs text-ink-500 select-none">共 {total} 家店铺</p>

      {loading ? (
        <div className="space-y-2"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
      ) : stores.length === 0 ? (
        <EmptyState icon="search" title="没有店铺" description="还没有人上传店铺" />
      ) : (
        <div className="space-y-2">
          {stores.map((store) => (
            <Card key={store.id} padding="md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-ink-50 text-sm truncate">{store.name}</h4>
                    <Badge variant="accent" size="sm">{catLabel(store.category)}</Badge>
                    <Badge variant={
                      store.status === "ACTIVE" ? "sage" :
                      store.status === "CLOSED" ? "default" :
                      "danger"
                    } size="sm">
                      {store.status === "ACTIVE" ? "正常" : store.status === "CLOSED" ? "已关闭" : "已删除"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-2xs text-ink-500">
                    <span>上传者: {store.uploader?.nickname || "匿名"}</span>
                    <span>{store._count?.ratings || 0} 人评分</span>
                    <span>{formatRelativeTime(store.createdAt)}添加</span>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {store.status === "ACTIVE" && (
                    <Button variant="outline" size="sm" onClick={() => updateStatus(store.id, "CLOSED")}>
                      关闭
                    </Button>
                  )}
                  {store.status === "CLOSED" && (
                    <>
                      <Button variant="secondary" size="sm" onClick={() => updateStatus(store.id, "ACTIVE")}>
                        恢复
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => {
                        if (confirm(`永久删除 "${store.name}" ？此操作不可撤销。`)) {
                          updateStatus(store.id, "DELETED");
                        }
                      }}>
                        删除
                      </Button>
                    </>
                  )}
                  {store.status === "ACTIVE" && (
                    <Button variant="danger" size="sm" onClick={() => {
                      if (confirm(`永久删除 "${store.name}" ？此操作不可撤销。`)) {
                        updateStatus(store.id, "DELETED");
                      }
                    }}>
                      删除
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</Button>
          <span className="text-sm text-ink-300 tabular-nums">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>下一页</Button>
        </div>
      )}
    </div>
  );
}
