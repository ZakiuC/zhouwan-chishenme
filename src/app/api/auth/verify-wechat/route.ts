// POST /api/auth/verify-wechat — 验证微信号 + 返回密码状态

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ADMIN_IDS = (process.env.ADMIN_WECHAT_IDS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export async function POST(request: Request) {
  try {
    const { wechatId } = await request.json();

    if (!wechatId || typeof wechatId !== "string" || !wechatId.trim()) {
      return NextResponse.json({ valid: false, message: "请输入微信号" }, { status: 400 });
    }

    const trimmed = wechatId.trim();

    let whitelistEntry = await prisma.whitelist.findUnique({
      where: { wechatId: trimmed },
    });

    if (!whitelistEntry && ADMIN_IDS.includes(trimmed)) {
      whitelistEntry = await prisma.whitelist.create({
        data: { wechatId: trimmed, nickname: "管理员" },
      });
    }

    if (!whitelistEntry) {
      return NextResponse.json({ valid: false, message: "你的微信号未在邀请列表中" });
    }

    // 检查是否已有用户
    const existingUser = await prisma.user.findUnique({
      where: { wechatId: trimmed },
    });

    if (existingUser) {
      if (existingUser.status === "BANNED") {
        return NextResponse.json({ valid: false, message: "账号已被封禁，请联系管理员" });
      }
      return NextResponse.json({
        valid: true,
        message: "请输入密码登录",
        isUsed: true,
        hasPassword: !!existingUser.passwordHash,
        needsPassword: !existingUser.passwordHash,
      });
    }

    return NextResponse.json({
      valid: true,
      message: "验证通过，请设置密码",
      isUsed: false,
      needsPassword: true,
      nickname: whitelistEntry.nickname,
    });
  } catch {
    return NextResponse.json({ valid: false, message: "验证失败，请重试" }, { status: 500 });
  }
}
