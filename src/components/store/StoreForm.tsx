"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { MapSearch } from "./MapSearch";
import { STORE_CATEGORIES, MAP_PROVIDERS } from "@/lib/constants";
import { useToast } from "@/components/ui/Toast";

interface ML { provider: string; url: string; }
interface FormData { name: string; description: string; category: string; address: string; hasPrivateRoom: boolean; mapLinks: ML[]; }

export function StoreForm({ initialData, storeId }: { initialData?: FormData; storeId?: string }) {
  const router = useRouter(); const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showMapSearch, setShowMapSearch] = useState(false);
  const [form, setForm] = useState<FormData>(initialData || {
    name: "", description: "", category: "", address: "", hasPrivateRoom: false,
    mapLinks: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const up = (f: keyof FormData, v: any) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: "" })); };
  const addML = () => {
    if (form.mapLinks.length >= 3) { showToast("最多3个地图链接", "error"); return; }
    const used = form.mapLinks.map(m => m.provider);
    const next = MAP_PROVIDERS.find(mp => !used.includes(mp.value));
    if (!next) return;
    setForm(p => ({ ...p, mapLinks: [...p.mapLinks, { provider: next.value, url: "" }] }));
  };
  const upML = (i: number, url: string) => setForm(p => ({ ...p, mapLinks: p.mapLinks.map((m, j) => j === i ? { ...m, url } : m) }));
  const rmML = (i: number) => setForm(p => ({ ...p, mapLinks: p.mapLinks.filter((_, j) => j !== i) }));

  const handleMapSelect = (result: { name: string; address: string; longitude: number; latitude: number }, provider: string) => {
    setForm(p => ({
      ...p,
      name: p.name || result.name,
      address: p.address || result.address,
      mapLinks: [
        ...p.mapLinks.filter(ml => ml.provider !== provider),
        { provider, url: buildMapUrl(provider, result) },
      ],
    }));
    setShowMapSearch(false);
    showToast("已自动填充店铺信息", "success");
  };

  const buildMapUrl = (provider: string, r: { name: string; longitude: number; latitude: number }) => {
    switch (provider) {
      case "AMAP": return `https://uri.amap.com/marker?position=${r.longitude},${r.latitude}&name=${encodeURIComponent(r.name)}`;
      case "BAIDU": return `https://api.map.baidu.com/marker?location=${r.latitude},${r.longitude}&title=${encodeURIComponent(r.name)}&content=${encodeURIComponent(r.name)}&output=html`;
      case "TENCENT": return `https://apis.map.qq.com/uri/v1/marker?marker=coord:${r.latitude},${r.longitude};title:${encodeURIComponent(r.name)}`;
      default: return "";
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ne: Record<string, string> = {};
    if (!form.name.trim()) ne.name = "请输入店铺名称";
    if (form.mapLinks.some(m => !m.url.trim())) ne.mapLinks = "请填写所有地图链接";
    if (Object.keys(ne).length > 0) { setErrors(ne); return; }
    setLoading(true);
    try {
      const url = storeId ? `/api/stores/${storeId}` : "/api/stores";
      const res = await fetch(url, { method: storeId ? "PUT" : "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(), description: form.description.trim() || undefined,
          category: form.category || undefined, address: form.address.trim() || undefined,
          hasPrivateRoom: form.hasPrivateRoom,
          mapLinks: form.mapLinks.filter(m => m.url.trim()),
        }) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "提交失败"); }
      const result = await res.json();
      showToast(storeId ? "已更新" : "添加成功！", "success");
      router.push(`/stores/${result.id}`); router.refresh();
    } catch (err: any) { showToast(err.message, "error"); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4 animate-fade-up">
      <Card>
        <div className="space-y-4">
          <Input id="name" label="店铺名称 *" placeholder="例如：老王家火锅" value={form.name} onChange={e => up("name", e.target.value)} error={errors.name} maxLength={50} />
          <div><label className="block text-sm font-medium text-paper-300 mb-1.5 select-none">分类</label><Select value={form.category} onChange={v => up("category", v)} options={STORE_CATEGORIES.map(c => ({ value: c.value, label: c.label }))} placeholder="选择分类" /></div>

          {/* 包厢开关 */}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-paper-300 select-none flex items-center gap-1">
              <Icon name="utensils" size={14} />有无包厢
            </span>
            <button
              type="button"
              onClick={() => up("hasPrivateRoom", !form.hasPrivateRoom)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                form.hasPrivateRoom ? "bg-gold-500" : "bg-base-500"
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                form.hasPrivateRoom ? "translate-x-5" : "translate-x-0"
              }`} />
            </button>
          </div>

          <div><label className="block text-sm font-medium text-paper-300 mb-1.5 select-none">简短描述</label><textarea value={form.description} onChange={e => up("description", e.target.value)} maxLength={500} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-base-600 border border-base-400/50 text-paper-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent-400/30 focus:border-accent-400/50 transition-all" placeholder="说说这家店的特色..." /><p className="text-2xs text-paper-600 mt-1">{form.description.length}/500</p></div>
          <Input id="address" label="地址" placeholder="例如：北京市朝阳区建国路88号" value={form.address} onChange={e => up("address", e.target.value)} maxLength={200} />
        </div>
      </Card>

      {/* 地图搜索 */}
      <Card>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-paper-200 text-sm select-none flex items-center gap-1"><Icon name="map-pin" size={14} />地图链接</h4>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowMapSearch(!showMapSearch)}>
                <Icon name="search" size={12} className="mr-1" />{showMapSearch ? "收起" : "搜索店铺"}
              </Button>
              {form.mapLinks.length < 3 && (
                <Button type="button" variant="outline" size="sm" onClick={addML}><Icon name="plus" size={12} className="mr-1" />添加</Button>
              )}
            </div>
          </div>

          {showMapSearch && (
            <div className="bg-base-800/60 rounded-xl p-3 border border-base-500/20">
              <MapSearch onSelect={handleMapSelect} onClose={() => setShowMapSearch(false)} />
            </div>
          )}

          {errors.mapLinks && <p className="text-xs text-red-400">{errors.mapLinks}</p>}
          {form.mapLinks.length === 0 && !showMapSearch && <p className="text-sm text-paper-500 py-2">添加百度/高德/腾讯地图的分享链接，或使用搜索自动填充</p>}
          {form.mapLinks.map((ml, i) => {
            const p = MAP_PROVIDERS.find(p => p.value === ml.provider);
            return (
              <div key={ml.provider} className="flex items-center gap-2">
                <span className="text-2xs font-medium px-2 py-1 rounded-md min-w-[60px] text-center select-none" style={{ backgroundColor: p?.color + "20", color: p?.color }}>{p?.label}</span>
                <div className="flex-1 relative">
                  <input type="url" value={ml.url} onChange={e => upML(i, e.target.value)} placeholder={`粘贴${p?.label}分享链接`} className="w-full h-9 px-3 pr-8 rounded-lg bg-base-600 border border-base-400/50 text-paper-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400/30" />
                  <button type="button" onClick={() => rmML(i)} className="absolute right-2 top-1/2 -translate-y-1/2 text-paper-500 hover:text-red-400"><Icon name="cross" size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Button type="submit" className="w-full" size="lg" loading={loading}>{storeId ? "保存修改" : <><Icon name="plus" size={16} className="mr-1" />提交店铺</>}</Button>
    </form>
  );
}
