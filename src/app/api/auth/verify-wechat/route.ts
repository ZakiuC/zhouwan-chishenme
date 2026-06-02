// POST /api/auth/verify-wechat — 验证微信号是否在白名单

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { wechatId } = await request.json();

    if (!wechatId || typeof wechatId !== "string" || !wechatId.trim()) {
      return NextResponse.json(
        { valid: false, message: "请输入微信号" },
        { status: 400 }
      );
    }

    const trimmed = wechatId.trim();

    const whitelistEntry = await prisma.whitelist.findUnique({
      where: { wechatId: trimmed },
    });

    if (!whitelistEntry) {
      return NextResponse.json({
        valid: false,
        message: "你的微信号未在邀请列表中，请联系管理员添加",
      });
    }

    if (whitelistEntry.isUsed) {
      return NextResponse.json({
        valid: true,
        message: "该微信号已注册，即将自动登录",
        isUsed: true,
      });
    }

    return NextResponse.json({
      valid: true,
      message: "验证通过",
      isUsed: false,
      nickname: whitelistEntry.nickname,
    });
  } catch {
    return NextResponse.json(
      { valid: false, message: "验证失败，请重试" },
      { status: 500 }
    );
  }
}
