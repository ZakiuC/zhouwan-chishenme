# 周日晚饭吃什么

微信群内部工具，解决"周日晚上不知道吃什么"的问题。群友上传推荐店铺、多维评分、排行榜、随机推荐。

## 技术栈

Next.js 14 + TypeScript + Prisma/SQLite + Tailwind CSS + NextAuth.js + SWR

## 本地开发

```bash
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
# → http://localhost:3000
```

### 种子账号

| 角色 | 微信号 |
|------|--------|
| 管理员 | `admin_test` |
| 普通用户 | `test_user1` `test_user2` `test_user3` |

管理员在 `/admin/whitelist` 添加更多微信号。

### 环境变量

复制 `.env.example` 为 `.env`：

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="本地随便填"
ADMIN_WECHAT_IDS="admin_test"
```

## 功能

- **认证**：微信号白名单验证，一号一人
- **店铺**：上传店铺 + 百度/高德/腾讯地图链接，手机端唤起地图 APP
- **评分**：六维评分（想吃指数、吃过评级、口味、性价比、环境、速度），SVG 雷达图
- **排行**：店铺排行 + 用户贡献度排行
- **随机**：加权随机推荐，自动排除近期推荐

## 部署 (Vercel)

Vercel 免费提供 `xxx.vercel.app` 域名，无需自己买域名。

### 1. 推送代码

```bash
git remote add origin git@github.com:ZakiuC/zhouwan-chishenme.git
git branch -M main
git push -u origin main
```

### 2. Vercel 导入项目

打开 [vercel.com](https://vercel.com)，用 GitHub 登录 → Add New → Project → 选择 `zhouwan-chishenme`。

### 3. 配置环境变量

Settings → Environment Variables，添加：

| NAME | VALUE |
|------|-------|
| `DATABASE_URL` | `file:./dev.db` |
| `NEXTAUTH_URL` | `https://你的项目名.vercel.app` |
| `NEXTAUTH_SECRET` | 执行 `openssl rand -base64 32` 生成 |
| `ADMIN_WECHAT_IDS` | `微信号1,微信号2` |

### 4. Deploy

点击 Deploy，等待 1-2 分钟。完成后访问 Vercel 分配的链接。

### 5. 上线后操作

- 管理员登录 → `/admin/whitelist` → 添加群友微信号
- 群友首次打开网站 → 输入微信号 → 自动验证登录

## 正式使用注意事项

- **数据库持久化**：Vercel serverless 环境下 SQLite 数据不持久（每次部署重置）。正式使用建议升级到 PostgreSQL：
  1. Vercel 控制台创建 Vercel Postgres（免费 256MB）
  2. 修改 `prisma/schema.prisma` 中 `provider` 为 `"postgresql"`
  3. 更新 `DATABASE_URL` 为 PostgreSQL 连接地址
  4. 运行 `npx prisma migrate deploy`
- **白名单导入**：可将所有群友微信号批量添加到白名单
- **评分维度**：在 `src/lib/scoring/aggregate.ts` 调整权重
- **店铺分类**：在 `src/lib/constants.ts` 修改 `STORE_CATEGORIES`
