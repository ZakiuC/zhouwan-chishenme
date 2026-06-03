"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { maskWechatId } from "@/lib/utils";

export default function SettingsPage() {
  const { data: session, update } = useSession(); const [nickname, setNickname] = useState(session?.user?.name || "");
  const [saving, setSaving] = useState(false); const { showToast } = useToast(); const router = useRouter();

  const save = async () => {
    if (!nickname.trim()) { showToast("昵称不能为空", "error"); return; } setSaving(true);
    try {
      const res = await fetch("/api/user/update-profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nickname: nickname.trim() }) });
      if (!res.ok) throw new Error("保存失败"); await update({ name: nickname.trim() }); showToast("昵称已更新", "success"); router.back();
    } catch { showToast("保存失败", "error"); } finally { setSaving(false); }
  };

  return <div className="space-y-5 animate-fade-up">
    <div><p className="text-2xs tracking-[0.15em] uppercase text-caramel-400 font-semibold mb-1 select-none">Settings</p><h2 className="text-xl font-bold text-ink-50 flex items-center gap-2"><Icon name="gear" size={20} className="text-caramel-400" />设置</h2></div>
    <Card>
      <div className="space-y-4">
        <Input label="昵称" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="设置你的昵称" />
        <div><label className="block text-sm font-medium text-ink-200 mb-1.5 select-none">微信号</label><div className="h-10 px-4 rounded-xl bg-ink-800 border border-ink-700/50 text-sm text-ink-500 flex items-center select-none">{maskWechatId(session?.user?.wechatId || "")}<span className="text-2xs ml-2 text-ink-500">（不可修改）</span></div></div>
        <Button className="w-full" onClick={save} loading={saving}>保存修改</Button>
      </div>
    </Card>
  </div>;
}
