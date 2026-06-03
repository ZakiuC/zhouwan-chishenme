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
  const [wechatId, setWechatId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { showToast } = useToast();

  // 步骤1：验证微信号
  const handleVerify = async () => {
    if (!wechatId.trim()) { setError("请输入微信号"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/verify-wechat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wechatId: wechatId.trim() }),
      });
      const data = await res.json();
      if (!data.valid) { setError(data.message || "验证失败"); return; }

      if (data.needsPassword) {
        setStep("set-password");
        showToast(data.isUsed ? "请设置你的登录密码" : "验证通过，请设置密码", "info");
      } else {
        setStep("password");
      }
    } catch { setError("网络错误"); } finally { setLoading(false); }
  };

  // 步骤2a：密码登录
  const handleLogin = async () => {
    if (!password.trim()) { setError("请输入密码"); return; }
    setLoading(true); setError("");
    try {
      const result = await signIn("wechat", {
        wechatId: wechatId.trim(),
        password: password,
        redirect: false,
      });
      if (result?.error) {
        const errMap: Record<string, string> = {
          "WHITELIST_NOT_FOUND": "微信号未在邀请列表中",
          "ACCOUNT_BANNED": "账号已被封禁",
          "PASSWORD_NOT_SET": "请先设置密码",
          "密码错误": "密码错误",
          "CredentialsSignin": "密码错误",
        };
        setError(errMap[result.error] || result.error || "登录失败");
        if (result.error === "PASSWORD_NOT_SET") setStep("set-password");
        return;
      }
      showToast("登录成功！", "success");
      router.push(callbackUrl);
      router.refresh();
    } catch { setError("登录失败"); } finally { setLoading(false); }
  };

  // 步骤2b：设置密码（新用户或未设密码用户）
  const handleSetPassword = async () => {
    if (!password.trim() || password.length < 4) { setError("密码至少4位"); return; }
    setLoading(true); setError("");
    try {
      // 先设置密码
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wechatId: wechatId.trim(), password }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }

      // 然后登录
      const result = await signIn("wechat", {
        wechatId: wechatId.trim(),
        password: password,
        redirect: false,
      });
      if (result?.error) { setError("登录失败，请重试"); return; }
      showToast("密码已设置，登录成功！", "success");
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) { setError(err.message || "操作失败"); } finally { setLoading(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "wechat") handleVerify();
    else if (step === "password") handleLogin();
    else handleSetPassword();
  };

  const handleBack = () => {
    setStep("wechat");
    setPassword("");
    setError("");
  };

  return (
    <div className="min-h-screen flex bg-base-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-accent-500/8 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-gold-500/6 blur-3xl" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center px-5">
        <div className="w-full max-w-sm animate-scale-in">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-accent-500/20 backdrop-blur-sm mb-5 shadow-glow border border-accent-500/20">
              <Icon name="plate" size={40} className="text-accent-300" />
            </div>
            <h1 className="text-3xl font-bold text-paper-50 tracking-tight">周日晚饭吃什么</h1>
            <p className="text-paper-500 text-sm mt-2">
              {step === "wechat" && "群友专享 · 微信验证"}
              {step === "password" && "请输入登录密码"}
              {step === "set-password" && "设置你的登录密码"}
            </p>
          </div>

          <div className="bg-base-800/80 backdrop-blur-xl rounded-3xl border border-base-500/20 shadow-strong p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 微信号（所有步骤都显示，但密码步骤只读） */}
              <Input
                id="wechatId"
                label="微信号"
                placeholder="请输入你的微信号"
                value={wechatId}
                onChange={(e) => { setWechatId(e.target.value); setError(""); if (step !== "wechat") setStep("wechat"); }}
                error={step === "wechat" ? error : ""}
                disabled={loading || (step !== "wechat")}
              />

              {/* 密码输入（密码登录 / 设置密码步骤） */}
              {step !== "wechat" && (
                <Input
                  id="password"
                  label={step === "set-password" ? "设置密码（至少4位）" : "登录密码"}
                  type="password"
                  placeholder={step === "set-password" ? "设置你的密码" : "请输入密码"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  error={error}
                  disabled={loading}
                />
              )}

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                {step === "wechat" && "验证微信号"}
                {step === "password" && "登录"}
                {step === "set-password" && "设置密码并登录"}
              </Button>

              {/* 返回按钮 */}
              {step !== "wechat" && (
                <Button type="button" variant="ghost" className="w-full" onClick={handleBack} disabled={loading}>
                  返回重新输入
                </Button>
              )}
            </form>

            <p className="text-2xs text-paper-600 text-center mt-4 select-none">
              仅限微信群内成员使用 · 一号一人
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-base-900">
        <div className="text-center">
          <Icon name="plate" size={48} className="text-paper-600 mx-auto mb-3 animate-float" />
          <p className="text-paper-500">加载中...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
