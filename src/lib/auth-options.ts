// NextAuth 认证配置 — 微信号 + 密码

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const ADMIN_IDS = (process.env.ADMIN_WECHAT_IDS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "wechat",
      name: "微信号",
      credentials: {
        wechatId: { label: "微信号", type: "text" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.wechatId) {
          throw new Error("请输入微信号");
        }

        const wechatId = credentials.wechatId.trim();

        // 查询白名单
        const whitelistEntry = await prisma.whitelist.findUnique({
          where: { wechatId },
        });

        // 管理员自动入白名单
        if (!whitelistEntry && ADMIN_IDS.includes(wechatId)) {
          await prisma.whitelist.create({
            data: { wechatId, nickname: "管理员" },
          });
        } else if (!whitelistEntry) {
          throw new Error("WHITELIST_NOT_FOUND");
        }

        // 已有用户 → 校验密码
        const existingUser = await prisma.user.findUnique({
          where: { wechatId },
        });

        if (existingUser) {
          // 封禁检查
          if (existingUser.status === "BANNED") {
            throw new Error("ACCOUNT_BANNED");
          }
          // 未设密码 → 抛出特殊标记，前端引导设置密码
          if (!existingUser.passwordHash) {
            throw new Error("PASSWORD_NOT_SET");
          }
          // 验证密码
          if (!credentials.password) {
            throw new Error("请输入密码");
          }
          const valid = await bcrypt.compare(credentials.password, existingUser.passwordHash);
          if (!valid) {
            throw new Error("密码错误");
          }
          return {
            id: existingUser.id,
            name: existingUser.nickname || existingUser.wechatId,
            wechatId: existingUser.wechatId,
            role: existingUser.role,
          };
        }

        // 新用户 — 必须提供密码
        if (!credentials.password) {
          throw new Error("请设置密码");
        }

        const isAdmin = ADMIN_IDS.includes(wechatId);
        const passwordHash = await bcrypt.hash(credentials.password, 10);

        const [user] = await prisma.$transaction([
          prisma.user.create({
            data: {
              wechatId,
              nickname: whitelistEntry?.nickname || wechatId,
              role: isAdmin ? "ADMIN" : "USER",
              passwordHash,
            },
          }),
          prisma.whitelist.upsert({
            where: { wechatId },
            update: { isUsed: true },
            create: { wechatId, isUsed: true },
          }),
        ]);

        return {
          id: user.id,
          name: user.nickname || user.wechatId,
          wechatId: user.wechatId,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.wechatId = (user as any).wechatId;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.wechatId = token.wechatId as string;
      session.user.role = token.role as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
