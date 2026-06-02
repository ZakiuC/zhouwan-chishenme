// 数据库种子脚本 — 预置白名单和示例数据

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 开始填充数据库...");

  // 1. 创建白名单
  const wechatIds = ["test_user1", "test_user2", "test_user3", "admin_test"];
  const whitelistData = wechatIds.map((id, i) => ({
    wechatId: id,
    nickname: id === "admin_test" ? "管理员" : `测试用户${i + 1}`,
  }));

  for (const entry of whitelistData) {
    await prisma.whitelist.upsert({
      where: { wechatId: entry.wechatId },
      update: {},
      create: entry,
    });
  }
  console.log(`✅ 白名单已创建 (${wechatIds.length} 条)`);

  // 2. 创建管理员用户
  const admin = await prisma.user.upsert({
    where: { wechatId: "admin_test" },
    update: { role: "ADMIN" },
    create: {
      wechatId: "admin_test",
      nickname: "管理员",
      role: "ADMIN",
    },
  });

  // 标记管理员白名单为已使用
  await prisma.whitelist.update({
    where: { wechatId: "admin_test" },
    data: { isUsed: true },
  });
  console.log("✅ 管理员用户已创建");

  // 3. 创建示例店铺
  const stores = [
    {
      name: "老王家火锅",
      description: "正宗重庆火锅，牛油锅底超级香，菜品新鲜分量足",
      category: "HOTPOT",
      address: "北京市朝阳区建国路88号",
    },
    {
      name: "一兰拉面",
      description: "日式豚骨拉面，汤底浓郁，叉烧入口即化",
      category: "JAPANESE",
      address: "北京市海淀区中关村大街1号",
    },
    {
      name: "大董烤鸭",
      description: "北京烤鸭老字号，皮脆肉嫩，环境优雅",
      category: "CHINESE",
      address: "北京市东城区王府井大街200号",
    },
    {
      name: "韩式烤肉王",
      description: "正宗韩式烤肉，五花肉厚切，小菜无限续",
      category: "BBQ",
      address: "北京市西城区西单北大街120号",
    },
    {
      name: "深夜食堂",
      description: "日式居酒屋风格，氛围温馨，适合小聚",
      category: "JAPANESE",
      address: "北京市朝阳区三里屯路50号",
    },
  ];

  for (const data of stores) {
    const store = await prisma.store.create({
      data: {
        ...data,
        uploaderId: admin.id,
        mapLinks: {
          create: [
            {
              provider: "AMAP",
              url: "https://surl.amap.com/example",
            },
            {
              provider: "BAIDU",
              url: "https://j.map.baidu.com/example",
            },
          ],
        },
      },
    });
    console.log(`✅ 店铺已创建: ${store.name}`);
  }

  console.log("\n🎉 数据库填充完成！");
  console.log("   - 管理员账号: admin_test");
  console.log("   - 测试账号: test_user1, test_user2, test_user3");
  console.log("   - 请在 .env 中设置 ADMIN_WECHAT_IDS=admin_test");
}

main()
  .catch((e) => {
    console.error("❌ 种子脚本失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
