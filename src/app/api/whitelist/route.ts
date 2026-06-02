// 白名单管理 API (管理员)

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/whitelist — 获取白名单列表
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const isUsed = searchParams.get("isUsed");

    const where: any = {};
    if (q) where.wechatId = { contains: q };
    if (isUsed !== null && isUsed !== "") where.isUsed = isUsed === "true";

    const entries = await prisma.whitelist.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("获取白名单失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

// POST /api/whitelist — 添加白名单
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const body = await request.json();

    // 支持单个或批量添加
    const entries = Array.isArray(body) ? body : [body];

    const results = [];
    for (const entry of entries) {
      if (!entry.wechatId) continue;
      const result = await prisma.whitelist.upsert({
        where: { wechatId: entry.wechatId.trim() },
        update: {},
        create: {
          wechatId: entry.wechatId.trim(),
          nickname: entry.nickname || undefined,
        },
      });
      results.push(result);
    }

    return NextResponse.json({ entries: results }, { status: 201 });
  } catch (error) {
    console.error("添加白名单失败:", error);
    return NextResponse.json({ error: "添加失败" }, { status: 500 });
  }
}

// DELETE /api/whitelist — 删除白名单条目
export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const wechatId = searchParams.get("wechatId");

    if (!wechatId) {
      return NextResponse.json({ error: "请指定微信号" }, { status: 400 });
    }

    const entry = await prisma.whitelist.findUnique({ where: { wechatId } });
    if (!entry) {
      return NextResponse.json({ error: "该微信号不在白名单中" }, { status: 404 });
    }
    if (entry.isUsed) {
      return NextResponse.json({ error: "已注册用户不能删除" }, { status: 400 });
    }

    await prisma.whitelist.delete({ where: { wechatId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除白名单失败:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
