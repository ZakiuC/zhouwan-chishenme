// NextAuth 认证配置

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
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
        wechatId: {
          label: "微信号",
          type: "text",
          placeholder: "请输入你的微信号",
        },
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

        if (!whitelistEntry) {
          throw new Error("WHITELIST_NOT_FOUND");
        }

        // 检查是否已被注册
        if (whitelistEntry.isUsed) {
          // 已注册用户，返回已有账户
          const existingUser = await prisma.user.findUnique({
            where: { wechatId },
          });
          if (!existingUser) {
            throw new Error("用户数据异常，请联系管理员");
          }
          return {
            id: existingUser.id,
            name: existingUser.nickname || existingUser.wechatId,
            wechatId: existingUser.wechatId,
            role: existingUser.role,
          };
        }

        // 新用户注册
        const isAdmin = ADMIN_IDS.includes(wechatId);
        const [user] = await prisma.$transaction([
          prisma.user.create({
            data: {
              wechatId,
              nickname: whitelistEntry.nickname || wechatId,
              role: isAdmin ? "ADMIN" : "USER",
            },
          }),
          prisma.whitelist.update({
            where: { wechatId },
            data: { isUsed: true },
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
