// 通用工具函数

/**
 * 合并 Tailwind CSS 类名
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

/**
 * 格式化日期为 "YYYY年MM月DD日" 格式
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 格式化日期为简短的相对时间（如 "3天前"）
 */
export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "今天";
  if (diffDays === 1) return "昨天";
  if (diffDays < 30) return `${diffDays}天前`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}个月前`;

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}年前`;
}

/**
 * 截断微信号显示（隐私保护）
 */
export function maskWechatId(wechatId: string): string {
  if (wechatId.length <= 4) return "****";
  return wechatId.slice(0, 2) + "****" + wechatId.slice(-2);
}

/**
 * 保留两位小数
 */
export function roundTwo(num: number): number {
  return Math.round(num * 100) / 100;
}
