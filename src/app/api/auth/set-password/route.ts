// POST /api/auth/set-password — 设置密码（新用户自动创建）

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const ADMIN_IDS = (process.env.ADMIN_WECHAT_IDS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export async function POST(request: Request) {
  try {
    const { wechatId, password } = await request.json();

    if (!wechatId || !password || typeof password !== "string" || password.length < 4) {
      return NextResponse.json({ error: "密码至少4位" }, { status: 400 });
    }

    const trimmed = wechatId.trim();
    const passwordHash = await bcrypt.hash(password, 10);

    let user = await prisma.user.findUnique({ where: { wechatId: trimmed } });

    if (user) {
      // 已有用户：更新密码
      await prisma.user.update({
        where: { wechatId: trimmed },
        data: { passwordHash },
      });
    } else {
      // 新用户：先验证白名单，再创建
      const whitelistEntry = await prisma.whitelist.findUnique({
        where: { wechatId: trimmed },
      });

      // 管理员自动加入白名单
      if (!whitelistEntry && ADMIN_IDS.includes(trimmed)) {
        await prisma.whitelist.create({ data: { wechatId: trimmed, nickname: "管理员" } });
      } else if (!whitelistEntry) {
        return NextResponse.json({ error: "微信号未在邀请列表中" }, { status: 403 });
      }

      const isAdmin = ADMIN_IDS.includes(trimmed);
      await prisma.$transaction([
        prisma.user.create({
          data: {
            wechatId: trimmed,
            nickname: whitelistEntry?.nickname || trimmed,
            role: isAdmin ? "ADMIN" : "USER",
            passwordHash,
          },
        }),
        prisma.whitelist.upsert({
          where: { wechatId: trimmed },
          update: { isUsed: true },
          create: { wechatId: trimmed, isUsed: true, nickname: whitelistEntry?.nickname },
        }),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "设置失败" }, { status: 500 });
  }
}
