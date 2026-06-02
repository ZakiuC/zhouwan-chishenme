// 服务端数据缓存 — React.cache() 避免同一请求内重复查询

import { cache } from "react";
import { prisma } from "./prisma";

/** 获取首页数据（缓存单次请求内重复调用） */
export const getHomeData = cache(async () => {
  const [hot, latest, total] = await Promise.all([
    prisma.store.findMany({
      where: { status: "ACTIVE", ratingCount: { gt: 0 } },
      orderBy: { compositeScore: "desc" },
      take: 6,
      include: { uploader: { select: { nickname: true } }, _count: { select: { ratings: true } } },
    }),
    prisma.store.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { uploader: { select: { nickname: true } }, _count: { select: { ratings: true } } },
    }),
    prisma.store.count({ where: { status: "ACTIVE" } }),
  ]);
  return { hot, latest, total };
});

/** 获取店铺详情 */
export const getStoreDetail = cache(async (id: string) => {
  return prisma.store.findUnique({
    where: { id },
    include: {
      mapLinks: true,
      uploader: { select: { id: true, nickname: true, wechatId: true } },
      ratings: { include: { user: { select: { id: true, nickname: true } } }, orderBy: { createdAt: "desc" } },
      _count: { select: { ratings: true } },
    },
  });
});

/** 验证白名单 */
export const findWhitelist = cache(async (wechatId: string) => {
  return prisma.whitelist.findUnique({ where: { wechatId } });
});

/** 查找用户 */
export const findUser = cache(async (wechatId: string) => {
  return prisma.user.findUnique({ where: { wechatId } });
});

/** 获取用户贡献数据 */
export const getUserContributionData = cache(async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      stores: { where: { status: "ACTIVE" }, select: { compositeScore: true, ratingCount: true } },
      ratings: { select: { triedRating: true } },
    },
  });
});
