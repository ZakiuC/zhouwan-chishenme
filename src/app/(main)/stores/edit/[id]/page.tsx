"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { StoreForm } from "@/components/store/StoreForm";
import { Icon } from "@/components/ui/Icon";
import { DetailSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function EditStorePage() {
  const params = useParams(); const [store, setStore] = useState<any>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");

  useEffect(() => { (async () => { try { const res = await fetch(`/api/stores/${params.id}`); if (!res.ok) throw new Error("店铺不存在"); const d = await res.json(); setStore(d.store); } catch (e: any) { setError(e.message); } finally { setLoading(false); } })(); }, [params.id]);

  if (loading) return <DetailSkeleton />;
  if (error || !store) return <EmptyState icon="alert" title="加载失败" description={error} />;

  return <div className="space-y-4">
    <div>
      <p className="text-2xs tracking-[0.15em] uppercase text-caramel-400 font-semibold mb-1 select-none">Edit</p>
      <h2 className="text-xl font-bold text-ink-50 flex items-center gap-2"><Icon name="edit" size={20} className="text-caramel-400" />编辑店铺</h2>
    </div>
    <StoreForm storeId={store.id} initialData={{ name: store.name, description: store.description || "", category: store.category || "", address: store.address || "", hasPrivateRoom: store.hasPrivateRoom || false, mapLinks: (store.mapLinks || []).map((ml: any) => ({ provider: ml.provider, url: ml.url })) }} />
  </div>;
}
