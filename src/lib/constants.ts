// 常量定义

/** 店铺分类 */
export const STORE_CATEGORIES = [
  { value: "CHINESE", label: "中餐" },
  { value: "JAPANESE", label: "日料" },
  { value: "HOTPOT", label: "火锅" },
  { value: "BBQ", label: "烧烤" },
  { value: "SNACK", label: "小吃" },
  { value: "WESTERN", label: "西餐" },
  { value: "KOREAN", label: "韩料" },
  { value: "NOODLE", label: "面馆" },
  { value: "SEAFOOD", label: "海鲜" },
  { value: "DESSERT", label: "甜品" },
  { value: "FASTFOOD", label: "快餐" },
  { value: "OTHER", label: "其他" },
] as const;

/** 吃过评级 */
export const TRIED_RATINGS = [
  { value: "STRONGLY_RECOMMEND", label: "强烈推荐" },
  { value: "RECOMMEND", label: "推荐" },
  { value: "NEUTRAL", label: "还行" },
  { value: "NOT_RECOMMEND", label: "不推荐" },
  { value: "NOT_TRIED", label: "没吃过" },
] as const;

/** 吃过评级数值映射 */
export const TRIED_RATING_SCORE: Record<string, number> = {
  STRONGLY_RECOMMEND: 5,
  RECOMMEND: 4,
  NEUTRAL: 3,
  NOT_RECOMMEND: 2,
  NOT_TRIED: 0,
};

/** 评分维度名称 */
export const RATING_DIMENSIONS = [
  { key: "want", label: "想吃指数" },
  { key: "tried", label: "吃过评级" },
  { key: "taste", label: "口味" },
  { key: "value", label: "性价比" },
  { key: "ambience", label: "环境氛围" },
  { key: "speed", label: "上菜速度" },
] as const;

/** 地图提供商 */
export const MAP_PROVIDERS = [
  { value: "AMAP", label: "高德地图", color: "#1677FF" },
  { value: "BAIDU", label: "百度地图", color: "#DE3824" },
  { value: "TENCENT", label: "腾讯地图", color: "#07C160" },
] as const;

/** 店铺排序方式 */
export const STORE_SORT_OPTIONS = [
  { value: "compositeScore", label: "综合评分" },
  { value: "avgWantScore", label: "想吃指数" },
  { value: "ratingCount", label: "评分人数" },
  { value: "createdAt", label: "最新添加" },
] as const;

/** 分页 */
export const PAGE_SIZE = 10;
