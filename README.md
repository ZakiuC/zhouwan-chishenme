# 周日晚饭吃什么

解决微信群"周日晚上不知道吃什么"问题的内部工具。群友上传推荐店铺、多维评分、排行榜、随机推荐。

## 技术栈

| 层 | 技术 |
|---|------|
| 框架 | Next.js 14 (App Router) + TypeScript |
| 数据库 | Prisma ORM + SQLite |
| 样式 | Tailwind CSS |
| 认证 | NextAuth.js（自定义微信号凭据） |
| 客户端缓存 | SWR |
| 部署 | Vercel |

## 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 初始化数据库
npx prisma migrate dev --name init

# 3. 填充种子数据（预置白名单 + 示例店铺）
npm run db:seed

# 4. 启动开发服务器
npm run dev
```

打开 http://localhost:3000

### 测试账号

种子脚本默认创建以下账号：

| 角色 | 微信号 | 说明 |
|------|--------|------|
| 管理员 | `admin_test` | 可访问白名单管理页 |
| 普通用户 | `test_user1`、`test_user2`、`test_user3` | 未注册状态 |

管理员可以在 `/admin/whitelist` 添加更多微信号。

### 环境变量

`.env` 文件：

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="替换为随机字符串"
ADMIN_WECHAT_IDS="admin_test,admin2,admin3"   # 管理员微信号，逗号分隔
```

## 功能模块

### 认证系统
- 微信号白名单验证，一号一人，已注册不可重复
- 管理员可增删白名单

### 店铺管理
- 上传店铺（名称、分类、描述、地址）
- 支持百度/高德/腾讯地图链接
- 手机端自动跳转地图 APP，PC 端新标签页打开网页版

### 六维评分
- 想吃指数（1-5）
- 吃过评级（强烈推荐 / 推荐 / 还行 / 不推荐 / 没吃过）
- 口味 / 性价比 / 环境氛围 / 上菜速度（仅吃过者可评）
- 贝叶斯平滑综合评分 + SVG 雷达图

### 排行榜
- 店铺排行榜（综合评分降序，可按分类筛选）
- 用户贡献度排行榜（上传 + 评分 + 质量奖励加权）

### 随机推荐
- 加权随机算法（想吃指数 + 综合分 + 冷启动 boost）
- 自动排除近期推荐，支持分类过滤

## 部署上线

### Vercel 部署（推荐）

1. 将代码推送到 GitHub 仓库：
```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/你的用户名/zhouwan-chishenme.git
git push -u origin main
```

2. 打开 [vercel.com](https://vercel.com)，点击 **New Project**，导入 GitHub 仓库。

3. 配置环境变量（Settings → Environment Variables）：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `file:./dev.db` | SQLite 文件路径 |
| `NEXTAUTH_URL` | `https://你的域名.vercel.app` | 正式部署后的域名 |
| `NEXTAUTH_SECRET` | `生成一个随机字符串` | 用 `openssl rand -base64 32` 生成 |
| `ADMIN_WECHAT_IDS` | `微信号1,微信号2` | 管理员微信号列表 |

4. 在 `next.config.js` 中确保 SQLite 相关配置存在：
```js
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
};
```

5. 点击 **Deploy**。

6. 部署完成后，Vercel 会分配一个 `xxx.vercel.app` 域名。建议绑定自定义域名。

### 正式上线前检查清单

- [ ] 将 `.env` 中的 `NEXTAUTH_SECRET` 替换为高强度随机字符串
- [ ] 设置 `ADMIN_WECHAT_IDS` 为实际管理员微信号
- [ ] 在 `/admin/whitelist` 中添加群内所有成员的微信号
- [ ] 根据群友偏好修改店铺分类（`src/lib/constants.ts` 中的 `STORE_CATEGORIES`）
- [ ] 如需要可修改评分权重（`src/lib/scoring/aggregate.ts` 中的 `WEIGHTS`）
- [ ] 测试完整流程：白名单验证 → 登录 → 上传店铺 → 评分 → 排行 → 随机推荐
- [ ] 在手机端（iOS Safari / Android Chrome / 微信浏览器）测试地图跳转

### 维护说明

- **添加群友**：管理员访问 `/admin/whitelist`，输入微信号添加
- **数据库**：SQLite 单文件存储在 `prisma/dev.db`，Vercel 部署时注意数据库会随部署更新而重置（数据不持久）
- **数据持久化方案**：如需持久化数据，建议升级到 PostgreSQL（Vercel Postgres 或 Supabase），修改 `prisma/schema.prisma` 中 `datasource db` 的 `provider` 为 `"postgresql"` 并更新 `DATABASE_URL`

### 升级到 PostgreSQL（推荐生产环境使用）

Vercel 的无服务器函数环境下，SQLite 写入不可靠。正式使用建议：

1. 在 Vercel 控制台创建 **Vercel Postgres** 或使用 **Supabase**
2. 修改 `prisma/schema.prisma`：
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
3. 更新环境变量 `DATABASE_URL` 为 PostgreSQL 连接字符串
4. 运行 `npx prisma migrate deploy` 推送到生产库
5. 重新部署
