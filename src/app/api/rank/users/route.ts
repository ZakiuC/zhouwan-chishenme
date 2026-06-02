// 用户贡献度排行榜 API

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calcContributionScore } from "@/lib/scoring/contribution";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));

    // 获取所有用户（简化版：只查有贡献的人）
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nickname: true,
        wechatId: true,
        _count: {
          select: { stores: true, ratings: true },
        },
      },
    });

    // 计算每个用户的贡献分并排序
    const ranked = await Promise.all(
      users.map(async (user) => {
        const score = await calcContributionScore(user.id);
        return {
          id: user.id,
          nickname: user.nickname || user.wechatId,
          contributionScore: score,
          storeCount: user._count.stores,
          ratingCount: user._count.ratings,
        };
      })
    );

    ranked.sort((a, b) => b.contributionScore - a.contributionScore);

    const topUsers = ranked.slice(0, limit).map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    return NextResponse.json({ users: topUsers });
  } catch (error) {
    console.error("获取用户排行榜失败:", error);
    return NextResponse.json({ error: "获取排行失败" }, { status: 500 });
  }
}
