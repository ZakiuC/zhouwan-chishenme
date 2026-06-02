// 用户资料更新 API

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { nickname } = await request.json();

    if (!nickname || typeof nickname !== "string" || !nickname.trim()) {
      return NextResponse.json({ error: "昵称不能为空" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { nickname: nickname.trim() },
    });

    return NextResponse.json({
      id: updated.id,
      nickname: updated.nickname,
    });
  } catch (error) {
    console.error("更新资料失败:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
