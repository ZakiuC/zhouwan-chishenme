// 店铺排行榜 API

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));

    const where: any = {
      status: "ACTIVE",
      ratingCount: { gt: 0 },
    };
    if (category) where.category = category;

    const stores = await prisma.store.findMany({
      where,
      orderBy: { compositeScore: "desc" },
      take: limit,
      select: {
        id: true,
        name: true,
        category: true,
        compositeScore: true,
        avgWantScore: true,
        ratingCount: true,
        recommendCount: true,
        createdAt: true,
        uploader: { select: { nickname: true } },
      },
    });

    return NextResponse.json({ stores });
  } catch (error) {
    console.error("获取排行榜失败:", error);
    return NextResponse.json({ error: "获取排行榜失败" }, { status: 500 });
  }
}
