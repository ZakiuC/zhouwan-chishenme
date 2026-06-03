// POST /api/auth/set-password — 设置/修改密码

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { wechatId, password } = await request.json();

    if (!wechatId || !password || typeof password !== "string" || password.length < 4) {
      return NextResponse.json({ error: "密码至少4位" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { wechatId: wechatId.trim() } });
    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { wechatId: wechatId.trim() },
      data: { passwordHash },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "设置失败" }, { status: 500 });
  }
}
