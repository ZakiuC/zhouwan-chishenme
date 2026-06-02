// 地图链接 API — POST 添加 / DELETE 删除

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/stores/[id]/map-links — 添加地图链接
export async function POST(
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

    const { provider, url } = await request.json();

    if (!provider || !url) {
      return NextResponse.json({ error: "请提供地图类型和链接" }, { status: 400 });
    }

    const allowedProviders = ["AMAP", "BAIDU", "TENCENT"];
    if (!allowedProviders.includes(provider)) {
      return NextResponse.json({ error: "不支持的地图类型" }, { status: 400 });
    }

    const mapLink = await prisma.mapLink.upsert({
      where: {
        storeId_provider: {
          storeId: params.id,
          provider,
        },
      },
      update: { url },
      create: {
        storeId: params.id,
        provider,
        url,
      },
    });

    return NextResponse.json(mapLink, { status: 201 });
  } catch (error) {
    console.error("添加地图链接失败:", error);
    return NextResponse.json({ error: "添加地图链接失败" }, { status: 500 });
  }
}

// DELETE /api/stores/[id]/map-links — 删除地图链接
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
    if (store.uploaderId !== session.user.id) {
      return NextResponse.json({ error: "只能编辑自己上传的店铺" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider");

    if (!provider) {
      return NextResponse.json({ error: "请指定要删除的地图类型" }, { status: 400 });
    }

    await prisma.mapLink.deleteMany({
      where: {
        storeId: params.id,
        provider,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除地图链接失败:", error);
    return NextResponse.json({ error: "删除地图链接失败" }, { status: 500 });
  }
}
