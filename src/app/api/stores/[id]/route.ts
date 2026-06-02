// 店铺详情 API — GET / PUT / DELETE

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { storeUpdateSchema } from "@/lib/validators/store";

// GET /api/stores/[id] — 店铺详情
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    const store = await prisma.store.findUnique({
      where: { id: params.id },
      include: {
        mapLinks: true,
        uploader: {
          select: { id: true, nickname: true, wechatId: true },
        },
        ratings: {
          include: {
            user: {
              select: { id: true, nickname: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { ratings: true },
        },
      },
    });

    if (!store || store.status === "DELETED") {
      return NextResponse.json({ error: "店铺不存在" }, { status: 404 });
    }

    // 查找当前用户的评分
    let myRating = null;
    if (session?.user?.id) {
      myRating = await prisma.rating.findUnique({
        where: {
          userId_storeId: {
            userId: session.user.id,
            storeId: params.id,
          },
        },
      });
    }

    return NextResponse.json({ store, myRating });
  } catch (error) {
    console.error("获取店铺详情失败:", error);
    return NextResponse.json({ error: "获取店铺详情失败" }, { status: 500 });
  }
}

// PUT /api/stores/[id] — 更新店铺
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const store = await prisma.store.findUnique({ where: { id: params.id } });
    if (!store) {
      return NextResponse.json({ error: "店铺不存在" }, { status: 404 });
    }
    if (store.uploaderId !== session.user.id) {
      return NextResponse.json({ error: "只能编辑自己上传的店铺" }, { status: 403 });
    }

    const body = await request.json();
    const validation = storeUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "表单数据有误", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { mapLinks: _, ...updateData } = validation.data;
    const updated = await prisma.store.update({
      where: { id: params.id },
      data: updateData,
      include: {
        mapLinks: true,
        uploader: { select: { nickname: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("更新店铺失败:", error);
    return NextResponse.json({ error: "更新店铺失败" }, { status: 500 });
  }
}

// DELETE /api/stores/[id] — 软删除店铺
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const store = await prisma.store.findUnique({ where: { id: params.id } });
    if (!store) {
      return NextResponse.json({ error: "店铺不存在" }, { status: 404 });
    }
    if (store.uploaderId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限删除" }, { status: 403 });
    }

    await prisma.store.update({
      where: { id: params.id },
      data: { status: "DELETED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除店铺失败:", error);
    return NextResponse.json({ error: "删除店铺失败" }, { status: 500 });
  }
}
