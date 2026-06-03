"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/ui/Toast";

type Step = "wechat" | "password" | "set-password";

function LoginForm() {
  const [step, setStep] = useState<Step>("wechat");
  const [wechatId, setWechatId] = useState(""); const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const router = useRouter(); const searchParams = useSearchParams(); const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { showToast } = useToast();

  const handleVerify = async () => {
    if (!wechatId.trim()) { setError("请输入微信号"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/verify-wechat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ wechatId: wechatId.trim() }) });
      const data = await res.json();
      if (!data.valid) { setError(data.message); return; }
      if (data.needsPassword) { setStep("set-password"); showToast("请设置登录密码", "info"); }
      else { setStep("password"); }
    } catch { setError("网络错误"); } finally { setLoading(false); }
  };

  const handleLogin = async () => {
    if (!password.trim()) { setError("请输入密码"); return; }
    setLoading(true); setError("");
    try {
      const result = await signIn("wechat", { wechatId: wechatId.trim(), password, redirect: false });
      if (result?.error) {
        const m: Record<string, string> = { "WHITELIST_NOT_FOUND": "未在邀请列表中", "ACCOUNT_BANNED": "账号已封禁", "PASSWORD_NOT_SET": "请先设置密码", "CredentialsSignin": "密码错误" };
        setError(m[result.error] || result.error || "登录失败");
        if (result.error === "PASSWORD_NOT_SET") setStep("set-password");
        return;
      }
      showToast("登录成功", "success"); router.push(callbackUrl); router.refresh();
    } catch { setError("登录失败"); } finally { setLoading(false); }
  };

  const handleSetPassword = async () => {
    if (!password.trim() || password.length < 4) { setError("密码至少4位"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/set-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ wechatId: wechatId.trim(), password }) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      const result = await signIn("wechat", { wechatId: wechatId.trim(), password, redirect: false });
      if (result?.error) { setError("登录失败"); return; }
      showToast("密码已设置", "success"); router.push(callbackUrl); router.refresh();
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const submit = (e: React.FormEvent) => { e.preventDefault(); if (step === "wechat") handleVerify(); else if (step === "password") handleLogin(); else handleSetPassword(); };

  return (
    <div className="min-h-screen flex bg-ink relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-caramel-500/3 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-caramel-500/2 blur-3xl" />
      </div>
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-5">
        <div className="w-full max-w-sm animate-reveal-scale">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-caramel-500/10 ring-1 ring-caramel-500/20">
              <Icon name="plate" size={32} className="text-caramel-400" />
            </div>
            <h1 className="text-3xl font-bold text-ink-50 tracking-tight">周日晚饭吃什么</h1>
            <p className="text-sm text-ink-500 mt-3 tracking-wide">
              {step === "wechat" && "群友专享"}
              {step === "password" && "输入密码"}
              {step === "set-password" && "设置密码"}
            </p>
          </div>

          <div className="bg-ink-900/80 ring-1 ring-ink-800 p-6 space-y-4">
            <form onSubmit={submit} className="space-y-4">
              <Input id="wechatId" label="微信号" placeholder="请输入微信号" value={wechatId}
                onChange={e => { setWechatId(e.target.value); setError(""); if (step !== "wechat") setStep("wechat"); }}
                error={step === "wechat" ? error : ""} disabled={loading || step !== "wechat"} />
              {step !== "wechat" && (
                <Input id="password" label={step === "set-password" ? "设置密码" : "密码"} type="password"
                  placeholder={step === "set-password" ? "至少4位" : "请输入密码"} value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }} error={error} disabled={loading} />
              )}
              <Button type="submit" className="w-full" size="lg" loading={loading}>
                {step === "wechat" && "验证"}
                {step === "password" && "登录"}
                {step === "set-password" && "设置并登录"}
              </Button>
              {step !== "wechat" && <Button type="button" variant="ghost" className="w-full" onClick={() => { setStep("wechat"); setPassword(""); setError(""); }} disabled={loading}>返回</Button>}
            </form>
            <p className="text-2xs text-ink-600 text-center tracking-widest uppercase">Members Only · One Per ID</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-ink"><div className="text-center"><Icon name="plate" size={40} className="text-ink-700 mx-auto mb-3 animate-float" /><p className="text-ink-600">加载中</p></div></div>}><LoginForm /></Suspense>;
}
