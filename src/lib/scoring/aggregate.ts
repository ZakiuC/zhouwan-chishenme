// 综合评分聚合算法

import { TRIED_RATING_SCORE } from "@/lib/constants";

interface RatingForCalc {
  wantScore: number;
  triedRating: string;
  tasteScore: number | null;
  valueScore: number | null;
  ambienceScore: number | null;
  speedScore: number | null;
}

// 各维度权重
const WEIGHTS = {
  want: 0.25,    // 想吃指数
  tried: 0.30,   // 吃过推荐度
  taste: 0.20,   // 口味
  value: 0.12,   // 性价比
  ambience: 0.08, // 环境氛围
  speed: 0.05,   // 上菜速度
};

/**
 * 单条评分的综合分 (0-5)
 */
function calcSingleRatingScore(input: RatingForCalc): number {
  const isTried = input.triedRating !== "NOT_TRIED";

  if (!isTried) {
    return input.wantScore;
  }

  const triedScore = TRIED_RATING_SCORE[input.triedRating] ?? 0;

  return (
    input.wantScore * WEIGHTS.want +
    triedScore * WEIGHTS.tried +
    (input.tasteScore ?? 0) * WEIGHTS.taste +
    (input.valueScore ?? 0) * WEIGHTS.value +
    (input.ambienceScore ?? 0) * WEIGHTS.ambience +
    (input.speedScore ?? 0) * WEIGHTS.speed
  );
}

/**
 * 店铺的综合评分：
 * 1. 对每条评分计算综合分
 * 2. 取加权平均（吃过者的权重更高）
 * 3. 贝叶斯平滑修正
 */
export function calcStoreCompositeScore(ratings: RatingForCalc[]): number {
  const C = 3; // 贝叶斯平滑常数
  const priorMean = 3.0; // 先验均值

  let totalScore = 0;
  let totalWeight = 0;

  for (const r of ratings) {
    const isTried = r.triedRating !== "NOT_TRIED";
    const weight = isTried ? 2.0 : 1.0;
    const score = calcSingleRatingScore(r);
    totalScore += score * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;

  const rawMean = totalScore / totalWeight;

  // 贝叶斯平滑：小样本向先验均值回归
  const smoothed =
    (totalWeight * rawMean + C * priorMean) / (totalWeight + C);

  return Math.round(smoothed * 100) / 100;
}
