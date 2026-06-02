// 随机推荐 API

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { weightedRandomSelect } from "@/lib/random/weighted-random";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";
    const excludeRaw = searchParams.get("exclude") || "";

    const excludeIds = excludeRaw.split(",").filter(Boolean);

    const where: any = {
      status: "ACTIVE",
    };
    if (category) where.category = category;

    const stores = await prisma.store.findMany({
      where,
      select: {
        id: true,
        name: true,
        compositeScore: true,
        avgWantScore: true,
        ratingCount: true,
        recommendCount: true,
        category: true,
        address: true,
        description: true,
        mapLinks: {
          select: { id: true, provider: true, url: true, longitude: true, latitude: true },
        },
        uploader: {
          select: { nickname: true },
        },
      },
    });

    // 先尝试排除近期推荐
    let selected = weightedRandomSelect(stores, excludeIds);
    // 如果排除后没候选了，忽略排除再试一次
    if (!selected) {
      selected = weightedRandomSelect(stores, []);
    }

    if (!selected) {
      return NextResponse.json({ error: "还没有店铺，快去添加吧" }, { status: 404 });
    }

    return NextResponse.json({ store: selected });
  } catch (error) {
    console.error("随机推荐失败:", error);
    return NextResponse.json({ error: "随机推荐失败" }, { status: 500 });
  }
}
