// 管理员用户管理 API

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET — 用户列表
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";

    const where: any = {};
    if (status) where.status = status;

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        wechatId: true,
        nickname: true,
        role: true,
        status: true,
        passwordHash: true,
        createdAt: true,
        _count: { select: { stores: true, ratings: true } },
      },
    });

    return NextResponse.json({
      users: users.map((u) => ({
        ...u,
        hasPassword: !!u.passwordHash,
        passwordHash: undefined,
      })),
    });
  } catch (error) {
    console.error("获取用户列表失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

// PATCH — 管理用户
export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const { userId, action } = await request.json();

    if (!userId || !action) {
      return NextResponse.json({ error: "缺少参数" }, { status: 400 });
    }

    switch (action) {
      case "ban":
        await prisma.user.update({
          where: { id: userId },
          data: { status: "BANNED" },
        });
        break;
      case "unban":
        await prisma.user.update({
          where: { id: userId },
          data: { status: "ACTIVE" },
        });
        break;
      case "clear-password":
        await prisma.user.update({
          where: { id: userId },
          data: { passwordHash: null },
        });
        break;
      case "delete":
        // 删除用户及其关联数据
        await prisma.user.delete({ where: { id: userId } });
        break;
      default:
        return NextResponse.json({ error: "无效操作" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("用户管理操作失败:", error);
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}
