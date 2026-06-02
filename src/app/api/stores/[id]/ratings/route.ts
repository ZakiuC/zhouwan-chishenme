// 评分 API — POST 提交评分 / GET 获取评分列表

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ratingSchema } from "@/lib/validators/rating";
import { TRIED_RATING_SCORE } from "@/lib/constants";
import { calcStoreCompositeScore } from "@/lib/scoring/aggregate";

// POST /api/stores/[id]/ratings — 提交/更新评分 (upsert)
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const validation = ratingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "评分数据有误", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const store = await prisma.store.findUnique({ where: { id: params.id } });
    if (!store) {
      return NextResponse.json({ error: "店铺不存在" }, { status: 404 });
    }

    const data = validation.data;

    // Upsert 评分
    await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId: session.user.id,
          storeId: params.id,
        },
      },
      update: {
        wantScore: data.wantScore,
        triedRating: data.triedRating,
        tasteScore: data.tasteScore,
        valueScore: data.valueScore,
        ambienceScore: data.ambienceScore,
        speedScore: data.speedScore,
        comment: data.comment,
      },
      create: {
        userId: session.user.id,
        storeId: params.id,
        wantScore: data.wantScore,
        triedRating: data.triedRating,
        tasteScore: data.tasteScore,
        valueScore: data.valueScore,
        ambienceScore: data.ambienceScore,
        speedScore: data.speedScore,
        comment: data.comment,
      },
    });

    // 重新计算店铺缓存
    const allRatings = await prisma.rating.findMany({
      where: { storeId: params.id },
    });

    await updateStoreCachedScores(params.id, allRatings);

    // 返回更新后的评分
    const updatedRating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId: session.user.id,
          storeId: params.id,
        },
      },
    });

    return NextResponse.json(updatedRating);
  } catch (error) {
    console.error("提交评分失败:", error);
    return NextResponse.json({ error: "提交评分失败" }, { status: 500 });
  }
}

// GET /api/stores/[id]/ratings — 获取某店所有评分
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where: { storeId: params.id },
        include: {
          user: {
            select: { id: true, nickname: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.rating.count({ where: { storeId: params.id } }),
    ]);

    return NextResponse.json({
      ratings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("获取评分列表失败:", error);
    return NextResponse.json({ error: "获取评分列表失败" }, { status: 500 });
  }
}

/** 更新店铺的评分缓存字段 */
async function updateStoreCachedScores(
  storeId: string,
  ratings: Array<{
    wantScore: number;
    triedRating: string;
    tasteScore: number | null;
    valueScore: number | null;
    ambienceScore: number | null;
    speedScore: number | null;
  }>
) {
  if (ratings.length === 0) {
    await prisma.store.update({
      where: { id: storeId },
      data: {
        avgWantScore: 0,
        avgTasteScore: 0,
        avgValueScore: 0,
        avgAmbienceScore: 0,
        avgSpeedScore: 0,
        recommendCount: 0,
        notRecommendCount: 0,
        ratingCount: 0,
        compositeScore: 0,
      },
    });
    return;
  }

  // 各维度均值
  const avgField = (field: keyof typeof ratings[0]) => {
    const values = ratings
      .map((r) => (typeof r[field] === "number" ? (r[field] as number) : null))
      .filter((v): v is number => v !== null);
    return values.length > 0
      ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100
      : 0;
  };

  // 推荐/不推荐计数
  const recommendCount = ratings.filter(
    (r) => r.triedRating === "STRONGLY_RECOMMEND" || r.triedRating === "RECOMMEND"
  ).length;
  const notRecommendCount = ratings.filter(
    (r) => r.triedRating === "NOT_RECOMMEND"
  ).length;

  // 综合评分
  const compositeScore = calcStoreCompositeScore(ratings);

  await prisma.store.update({
    where: { id: storeId },
    data: {
      avgWantScore: avgField("wantScore"),
      avgTasteScore: avgField("tasteScore"),
      avgValueScore: avgField("valueScore"),
      avgAmbienceScore: avgField("ambienceScore"),
      avgSpeedScore: avgField("speedScore"),
      recommendCount,
      notRecommendCount,
      ratingCount: ratings.length,
      compositeScore,
    },
  });
}
