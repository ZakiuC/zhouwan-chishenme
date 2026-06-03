// 店铺 API — GET 列表 / POST 创建

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { storeCreateSchema } from "@/lib/validators/store";
import { PAGE_SIZE } from "@/lib/constants";
import { Prisma } from "@prisma/client";

// GET /api/stores — 店铺列表（搜索/筛选/排序/分页）
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "compositeScore";
    const order = searchParams.get("order") || "desc";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || String(PAGE_SIZE))));

    // 构建查询条件
    const where: Prisma.StoreWhereInput = {
      status: "ACTIVE",
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { description: { contains: q } },
              { address: { contains: q } },
            ],
          }
        : {}),
      ...(category ? { category } : {}),
    };

    // 排序
    const orderBy: Prisma.StoreOrderByWithRelationInput = {};
    if (sort === "compositeScore") orderBy.compositeScore = order as Prisma.SortOrder;
    else if (sort === "avgWantScore") orderBy.avgWantScore = order as Prisma.SortOrder;
    else if (sort === "ratingCount") orderBy.ratingCount = order as Prisma.SortOrder;
    else if (sort === "createdAt") orderBy.createdAt = order as Prisma.SortOrder;
    else orderBy.compositeScore = "desc";

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          category: true,
          avgWantScore: true,
          compositeScore: true,
          ratingCount: true,
          recommendCount: true,
          createdAt: true,
          hasPrivateRoom: true,
          uploader: {
            select: { nickname: true },
          },
          _count: {
            select: { ratings: true },
          },
        },
      }),
      prisma.store.count({ where }),
    ]);

    return NextResponse.json({
      stores,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("获取店铺列表失败:", error);
    return NextResponse.json({ error: "获取店铺列表失败" }, { status: 500 });
  }
}

// POST /api/stores — 创建店铺
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const validation = storeCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "表单数据有误", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { name, description, category, address, mapLinks } = validation.data;

    const store = await prisma.store.create({
      data: {
        name,
        description,
        category,
        address,
        uploaderId: session.user.id,
        ...(mapLinks && mapLinks.length > 0
          ? {
              mapLinks: {
                create: mapLinks.map((ml) => ({
                  provider: ml.provider,
                  url: ml.url,
                })),
              },
            }
          : {}),
      },
      include: {
        mapLinks: true,
        uploader: { select: { nickname: true } },
      },
    });

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.error("创建店铺失败:", error);
    return NextResponse.json({ error: "创建店铺失败" }, { status: 500 });
  }
}
