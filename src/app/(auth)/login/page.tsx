"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/ui/Toast";

function LoginForm() {
  const [wechatId, setWechatId] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter(); const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { showToast } = useToast();

  const handleVerify = async () => {
    if (!wechatId.trim()) { setError("请输入微信号"); return; }
    setVerifying(true); setError("");
    try {
      const res = await fetch("/api/auth/verify-wechat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ wechatId: wechatId.trim() }) });
      const data = await res.json();
      if (!data.valid) { setError(data.message || "验证失败"); return; }
      setIsVerified(true); showToast("验证通过", "success");
    } catch { setError("网络错误"); } finally { setVerifying(false); }
  };

  const handleLogin = async () => {
    setLoading(true); setError("");
    try {
      const result = await signIn("wechat", { wechatId: wechatId.trim(), redirect: false });
      if (result?.error) { setError(result.error === "WHITELIST_NOT_FOUND" ? "微信号未在邀请列表中" : "登录失败"); setIsVerified(false); return; }
      showToast("登录成功！", "success"); router.push(callbackUrl); router.refresh();
    } catch { setError("登录失败"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-base-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-accent-500/8 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-gold-500/6 blur-3xl" />
        <div className="absolute top-1/4 right-12 w-20 h-20 rounded-full border border-accent-500/10" />
        <div className="absolute bottom-1/4 left-16 w-14 h-14 rounded-full border border-gold-500/10" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center px-5">
        <div className="w-full max-w-sm animate-scale-in">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-accent-500/20 backdrop-blur-sm mb-5 shadow-glow border border-accent-500/20">
              <Icon name="plate" size={40} className="text-accent-300" />
            </div>
            <h1 className="text-3xl font-bold text-paper-50 tracking-tight">周日晚饭吃什么</h1>
            <p className="text-paper-500 text-sm mt-2">{isVerified ? "验证通过，确认登录" : "群友专享 · 微信验证"}</p>
          </div>

          <div className="bg-base-800/80 backdrop-blur-xl rounded-3xl border border-base-500/20 shadow-strong p-6 space-y-4">
            <Input id="wechatId" label="微信号" placeholder="请输入你的微信号" value={wechatId}
              onChange={e => { setWechatId(e.target.value); setError(""); setIsVerified(false); }} error={error} disabled={loading || verifying}
              onKeyDown={e => { if (e.key === "Enter") { isVerified ? handleLogin() : handleVerify(); } }} />

            {isVerified ? (
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setIsVerified(false)} disabled={loading}>重新验证</Button>
                <Button className="flex-1" onClick={handleLogin} loading={loading}>确认登录</Button>
              </div>
            ) : <Button className="w-full" size="lg" onClick={handleVerify} loading={verifying}>验证并登录</Button>}
            <p className="text-2xs text-paper-600 text-center pt-1 select-none">仅限微信群内成员使用 · 一号一人</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center bg-base-900">
      <div className="text-center">
        <Icon name="plate" size={48} className="text-paper-600 mx-auto mb-3 animate-float" />
        <p className="text-paper-500">加载中...</p>
      </div>
    </div>
  }><LoginForm /></Suspense>;
}
