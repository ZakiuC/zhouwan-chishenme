"use client";

import { useState } from "react";
import { StarRating } from "./StarRating";
import { TriedRatingSelector } from "./TriedRatingSelector";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/ui/Toast";

interface RatingFormProps { storeId: string; existingRating?: any; onSuccess?: () => void; }

export function RatingForm({ storeId, existingRating, onSuccess }: RatingFormProps) {
  const { showToast } = useToast(); const [loading, setLoading] = useState(false);
  const [want, setWant] = useState(existingRating?.wantScore || 0);
  const [tried, setTried] = useState(existingRating?.triedRating || "NOT_TRIED");
  const [taste, setTaste] = useState(existingRating?.tasteScore || 0);
  const [value, setValue] = useState(existingRating?.valueScore || 0);
  const [amb, setAmb] = useState(existingRating?.ambienceScore || 0);
  const [speed, setSpeed] = useState(existingRating?.speedScore || 0);
  const [comment, setComment] = useState(existingRating?.comment || "");
  const isTried = tried !== "NOT_TRIED";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (want === 0) { showToast("请选择想吃指数", "error"); return; }
    if (isTried && (!taste || !value || !amb || !speed)) { showToast("吃过请完成所有评分", "error"); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/stores/${storeId}/ratings`, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wantScore: want, triedRating: tried, tasteScore: isTried ? taste : null, valueScore: isTried ? value : null, ambienceScore: isTried ? amb : null, speedScore: isTried ? speed : null, comment: comment.trim() || undefined }) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "提交失败"); }
      showToast("评分已提交！", "success"); onSuccess?.();
    } catch (err: any) { showToast(err.message, "error"); } finally { setLoading(false); }
  };

  return (
    <Card className="border-caramel-500/20">
      <form onSubmit={submit} className="space-y-5">
        <div className="flex items-center gap-2 select-none"><Icon name="star" size={18} className="text-caramel-400" /><h4 className="font-semibold text-ink-100">{existingRating ? "修改我的评分" : "我的评分"}</h4></div>
        <div className="bg-caramel-500/5 rounded-xl p-3 border border-caramel-500/10"><StarRating label="想吃指数 *" value={want} onChange={setWant} size="md" /></div>
        <TriedRatingSelector value={tried} onChange={setTried} />
        <div className={`space-y-3 ${!isTried ? "opacity-25 pointer-events-none" : ""}`}>
          <div className="bg-ink-900/60 rounded-xl p-3 space-y-2.5">
            <StarRating label={<span className="flex items-center gap-1"><Icon name="taste" size={14} />口味</span>} value={taste} onChange={setTaste} size="md" />
            <StarRating label={<span className="flex items-center gap-1"><Icon name="coin" size={14} />性价比</span>} value={value} onChange={setValue} size="md" />
            <StarRating label={<span className="flex items-center gap-1"><Icon name="leaf" size={14} />环境氛围</span>} value={amb} onChange={setAmb} size="md" />
            <StarRating label={<span className="flex items-center gap-1"><Icon name="lightning" size={14} />上菜速度</span>} value={speed} onChange={setSpeed} size="md" />
          </div>
        </div>
        {!isTried && <p className="text-xs text-ink-500 italic">选择吃过评级后解锁完整评分维度</p>}
        <div>
          <label className="block text-sm font-medium text-ink-200 mb-1.5 select-none flex items-center gap-1"><Icon name="chat" size={14} />文字评价（可选）</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} maxLength={300} rows={2} placeholder="说说你的感受..."
            className="w-full px-4 py-2.5 rounded-xl bg-ink-800 border border-ink-700/50 text-ink-50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-caramel-400/30 focus:border-caramel-400/50 transition-all" />
          <div className="flex justify-between mt-1"><span className="text-2xs text-ink-500">分享真实体验帮助大家选择</span><span className="text-2xs text-ink-500">{comment.length}/300</span></div>
        </div>
        <Button type="submit" className="w-full" loading={loading}>{existingRating ? <><Icon name="sparkle" size={14} className="mr-1" />更新评分</> : <><Icon name="pencil" size={14} className="mr-1" />提交评分</>}</Button>
      </form>
    </Card>
  );
}
