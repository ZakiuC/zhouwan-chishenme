// NextAuth 服务端辅助函数

import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";

/**
 * 获取当前服务端会话
 */
export async function getSession() {
  return getServerSession(authOptions);
}

/**
 * 获取当前登录用户（未登录时返回 null）
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * 验证是否为管理员
 */
export async function isAdmin() {
  const session = await getSession();
  return session?.user?.role === "ADMIN";
}
