// 统一类型导出

export * from "./next-auth";

/** 店铺分类类型 */
export type StoreCategory =
  | "CHINESE"
  | "JAPANESE"
  | "HOTPOT"
  | "BBQ"
  | "SNACK"
  | "WESTERN"
  | "KOREAN"
  | "NOODLE"
  | "SEAFOOD"
  | "DESSERT"
  | "FASTFOOD"
  | "OTHER";

/** 地图提供商 */
export type MapProvider = "AMAP" | "BAIDU" | "TENCENT";

/** 吃过评级 */
export type TriedRating =
  | "STRONGLY_RECOMMEND"
  | "RECOMMEND"
  | "NEUTRAL"
  | "NOT_RECOMMEND"
  | "NOT_TRIED";

/** 店铺状态 */
export type StoreStatus = "ACTIVE" | "CLOSED" | "DELETED";

/** 用户角色 */
export type UserRole = "USER" | "ADMIN";
