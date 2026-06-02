// 用户贡献度计算

import { prisma } from "@/lib/prisma";

/**
 * 计算用户的贡献度分数
 */
export async function calcContributionScore(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      stores: {
        where: { status: "ACTIVE" },
        select: {
          compositeScore: true,
          ratingCount: true,
        },
      },
      ratings: {
        select: {
          triedRating: true,
        },
      },
    },
  });

  if (!user) return 0;

  let score = 0;

  // 上传贡献
  for (const store of user.stores) {
    score += 10; // 基础分
    score += store.ratingCount * 2; // 被动贡献
    if (store.compositeScore > 3.5) {
      score += 5; // 好店奖励
    }
  }

  // 评分贡献
  for (const rating of user.ratings) {
    score += 5; // 基础分
    if (rating.triedRating !== "NOT_TRIED") {
      score += 3; // 深度评分奖励
    }
  }

  // 质量奖励
  const ratedStoresAvg =
    user.stores.length > 0
      ? user.stores.reduce((sum, s) => sum + s.compositeScore, 0) /
        user.stores.length
      : 0;
  const goodStoreRatio =
    user.stores.length > 0
      ? user.stores.filter((s) => s.compositeScore > 3.0).length /
        user.stores.length
      : 0;

  let qualityMultiplier = 1.0;
  if (ratedStoresAvg > 3.5) qualityMultiplier += 0.1;
  if (goodStoreRatio >= 0.8) qualityMultiplier += 0.15;

  return Math.round(score * qualityMultiplier);
}
