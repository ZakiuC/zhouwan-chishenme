// 加权随机推荐算法

interface StoreForRandom {
  id: string;
  name: string;
  compositeScore: number;
  avgWantScore: number;
  ratingCount: number;
  recommendCount: number;
}

/**
 * 计算随机权重
 * weight = 想吃指数×0.4 + 综合分×0.4 + 推荐率×5×0.2
 * 冷启动 boost: 评分人数少的店铺获得轻微加权
 */
function calcWeight(store: StoreForRandom): number {
  const { avgWantScore, compositeScore, recommendCount, ratingCount } = store;

  const recommendRate =
    ratingCount > 0 ? recommendCount / ratingCount : 0;
  const baseScore =
    avgWantScore * 0.4 + compositeScore * 0.4 + recommendRate * 5 * 0.2;

  // 冷启动 boost
  let boostFactor = 1.0;
  if (ratingCount === 0) {
    boostFactor = 1.3;
  } else if (ratingCount < 5) {
    boostFactor = 1.0 + (5 - ratingCount) * 0.04;
  }

  // 排除已被多次差评的店铺
  if (compositeScore < 0.5 && ratingCount >= 3) {
    return 0;
  }

  return Math.max(0, baseScore * boostFactor);
}

/**
 * 加权随机选择 (CDF + 二分查找)
 */
export function weightedRandomSelect(
  stores: StoreForRandom[],
  excludeIds: string[] = []
): StoreForRandom | null {
  const candidates = stores.filter((s) => !excludeIds.includes(s.id));
  if (candidates.length === 0) return null;

  const weights = candidates.map(calcWeight);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  if (totalWeight === 0) return null;

  // CDF
  const cdf: number[] = [];
  let cumulative = 0;
  for (const w of weights) {
    cumulative += w / totalWeight;
    cdf.push(cumulative);
  }

  // 随机采样
  const rand = Math.random();

  // 二分查找
  let low = 0;
  let high = cdf.length - 1;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (cdf[mid] < rand) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return candidates[low];
}
