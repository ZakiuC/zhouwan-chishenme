// 管理员店铺管理 API

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET — 管理员查看全部店铺
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const status = searchParams.get("status") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = 20;

    const where: any = {};
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
      ];
    }
    if (status) where.status = status;

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          uploader: { select: { id: true, nickname: true } },
          _count: { select: { ratings: true } },
        },
      }),
      prisma.store.count({ where }),
    ]);

    return NextResponse.json({ stores, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("获取店铺列表失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

// PATCH — 管理员修改店铺状态
export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const { storeId, status } = await request.json();

    if (!storeId || !status) {
      return NextResponse.json({ error: "缺少参数" }, { status: 400 });
    }

    const allowed = ["ACTIVE", "CLOSED", "DELETED"];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: "无效状态" }, { status: 400 });
    }

    await prisma.store.update({
      where: { id: storeId },
      data: { status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("更新店铺状态失败:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
