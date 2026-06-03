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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNick, setEditNick] = useState("");

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
      if (res.ok) { const data = await res.json(); setEntries(data.entries || []); }
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { if (session?.user?.role === "ADMIN") refreshList(); }, [refreshList, session]);

  const handleAdd = async () => {
    if (!newId.trim()) { showToast("请输入微信号", "error"); return; }
    setAdding(true);
    try {
      const res = await fetch("/api/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wechatId: newId.trim(), nickname: newNick.trim() || undefined }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      showToast("添加成功", "success");
      setNewId(""); setNewNick(""); refreshList();
    } catch (err: any) { showToast(err.message, "error"); } finally { setAdding(false); }
  };

  const handleEdit = async (wechatId: string) => {
    try {
      const res = await fetch("/api/whitelist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wechatId, nickname: editNick }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      showToast("已更新", "success");
      setEditingId(null); refreshList();
    } catch (err: any) { showToast(err.message, "error"); }
  };

  const handleDelete = async (wechatId: string) => {
    if (!confirm(`确定从白名单删除 "${wechatId}" ？${"\n"}已注册的用户也将被删除。`)) return;
    try {
      const res = await fetch(`/api/whitelist?wechatId=${wechatId}`, { method: "DELETE" });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      showToast("已删除", "success"); refreshList();
    } catch (err: any) { showToast(err.message, "error"); }
  };

  if (status === "loading") return <div className="p-8 text-center text-paper-500">加载中...</div>;
  if (session?.user?.role !== "ADMIN") return null;

  const registeredCount = entries.filter((e) => e.isUsed).length;

  return (
    <div className="space-y-4 animate-fade-up">
      <div>
        <p className="text-2xs tracking-[0.15em] uppercase text-accent-400 font-semibold mb-1 select-none">
          <a href="/admin" className="hover:text-accent-300">Admin</a> / Whitelist
        </p>
        <h2 className="text-xl font-bold text-paper-100 flex items-center gap-2"><Icon name="list" size={20} className="text-accent-400" />白名单管理</h2>
      </div>

      <Card>
        <div className="space-y-3">
          <h4 className="font-semibold text-paper-200 text-sm select-none">添加微信号</h4>
          <Input placeholder="微信号" value={newId} onChange={(e) => setNewId(e.target.value)} />
          <Input placeholder="备注昵称（可选）" value={newNick} onChange={(e) => setNewNick(e.target.value)} />
          <Button className="w-full" onClick={handleAdd} loading={adding}>添加到白名单</Button>
        </div>
      </Card>

      <Card>
        <div className="space-y-3">
          <Input placeholder="搜索..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <p className="text-xs text-paper-500 select-none">共 {entries.length} 人（{registeredCount} 已注册）</p>

          {entries.length === 0 ? (
            <EmptyState icon="list" title="白名单为空" description="添加微信群成员的微信号" />
          ) : (
            <div className="space-y-1">
              {entries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between py-2 gap-2">
                  {editingId === entry.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editNick}
                        onChange={(e) => setEditNick(e.target.value)}
                        placeholder={entry.wechatId}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={() => handleEdit(entry.wechatId)}>保存</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>取消</Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-paper-200 truncate">{entry.wechatId}</p>
                        {entry.nickname && <p className="text-2xs text-paper-500">{entry.nickname}</p>}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Badge variant={entry.isUsed ? "sage" : "default"}>{entry.isUsed ? "已注册" : "未注册"}</Badge>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setEditingId(entry.id);
                          setEditNick(entry.nickname || "");
                        }} title="编辑昵称">
                          <Icon name="edit" size={13} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(entry.wechatId)} title="删除">
                          <Icon name="cross" size={13} />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
