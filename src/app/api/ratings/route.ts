// 我的评分列表 API

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/ratings — 获取当前用户的所有评分
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where: { userId: session.user.id },
        include: {
          store: {
            select: { id: true, name: true, category: true },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.rating.count({ where: { userId: session.user.id } }),
    ]);

    return NextResponse.json({
      ratings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("获取我的评分失败:", error);
    return NextResponse.json({ error: "获取评分失败" }, { status: 500 });
  }
}
