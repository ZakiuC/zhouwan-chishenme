// SVG 图标 — 精确几何路径，无 arc 偏差

import { cn } from "@/lib/utils";

export type IconName =
  | "plate" | "home" | "list" | "trophy" | "dice"
  | "user" | "plus" | "fire" | "sparkle" | "star"
  | "thumbs-up" | "pencil" | "search" | "map-pin"
  | "chat" | "chart" | "taste" | "coin" | "leaf"
  | "lightning" | "utensils" | "phone" | "gear"
  | "logout" | "alert" | "bowl" | "medal"
  | "arrow-right" | "check" | "cross" | "info"
  | "edit" | "emoji-dizzy" | "trending" | "clock";

interface IconProps { name: IconName; size?: number; className?: string; }

interface PathSpec {
  d: string;
  fill?: string;
  opacity?: number;
  strokeW?: number;
  stroke?: string;
}

const ICONS: Record<IconName, PathSpec[]> = {
  // plate — 贝塞尔精确圆 + 内圈 + 蒸汽
  plate: [
    { d: "M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2z", fill: "currentColor", opacity: 0.15 },
    { d: "M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2z", fill: "none" },
    { d: "M8.5 4.5c.3-1.2 1.5-2 3.5-2s3.2.8 3.5 2", strokeW: 1.2, fill: "none" },
  ],

  home: [
    { d: "M2 10.5 12 2l10 8.5V20a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-9.5z", fill: "currentColor", opacity: 0.12 },
    { d: "M2 10.5 12 2l10 8.5V20a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-9.5zM9 21V11h6v10M10 15h4", fill: "none" },
    { d: "M16 6 18 4.5v4", strokeW: 1.2, fill: "none" },
  ],

  list: [
    { d: "M5 2h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z", fill: "currentColor", opacity: 0.1 },
    { d: "M5 2h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM8 7h9M8 11h9M8 15h6", fill: "none", strokeW: 1.5 },
  ],

  trophy: [
    { d: "M5 3h14v5a7 7 0 0 1-7 7h-3a7 7 0 0 1-7-7V3h3z", fill: "currentColor", opacity: 0.12 },
    { d: "M5 3h14v5a7 7 0 0 1-7 7h-3a7 7 0 0 1-7-7V3h3zM3 7a5 5 0 0 0 5 5M18 3h1a3 3 0 0 1 0 6h-1M12 15v6m-4 0h8M9 18h6", fill: "none" },
  ],

  dice: [
    { d: "M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z", fill: "currentColor", opacity: 0.1 },
    { d: "M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z", fill: "none" },
    { d: "M8.5 7.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3.5 3.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3.5-7.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7-3.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z", fill: "currentColor", stroke: "none" },
  ],

  user: [
    { d: "M17 20v-1a5 5 0 0 0-5-5h-2a5 5 0 0 0-5 5v1M12 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM7 20h10", fill: "currentColor", opacity: 0.1 },
    { d: "M17 20v-1a5 5 0 0 0-5-5h-2a5 5 0 0 0-5 5v1M12 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM7 20h10", fill: "none" },
  ],

  plus: [
    { d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", fill: "currentColor", opacity: 0.12 },
    { d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v12M6 12h12", fill: "none" },
  ],

  fire: [
    { d: "M12 2C8 7 4 10 4 14a8 8 0 0 0 16 0c0-4-4-7-8-12zM11 19a3 3 0 0 1-2-5.6c.5.6 1 1.3 1.5 1.7a3 3 0 0 1 .5 3.9z", fill: "currentColor", opacity: 0.14 },
    { d: "M12 2C8 7 4 10 4 14a8 8 0 0 0 16 0c0-4-4-7-8-12zM11 19a3 3 0 0 1-2-5.6c.5.6 1 1.3 1.5 1.7a3 3 0 0 1 .5 3.9z", fill: "none" },
  ],

  sparkle: [
    { d: "M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5z", fill: "currentColor", opacity: 0.2, stroke: "none" },
    { d: "M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5z", fill: "none" },
  ],

  star: [
    { d: "M12 2l3.1 6.3L22 9.7l-5 4.8L18.2 22 12 17.8 5.8 22 7 14.5l-5-4.8 6.9-1.4z", fill: "currentColor", opacity: 0.18, strokeW: 1.4 },
    { d: "M12 2l3.1 6.3L22 9.7l-5 4.8L18.2 22 12 17.8 5.8 22 7 14.5l-5-4.8 6.9-1.4z", fill: "none" },
  ],

  "thumbs-up": [
    { d: "M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3", fill: "currentColor", opacity: 0.1 },
    { d: "M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3m8-5v5a1 1 0 0 1-1 1h-3l-1 5c0 1.7 1.3 3 3 3h4.5a2 2 0 0 0 1.9-1.4l2.6-6.5A2 2 0 0 0 21 16h-5", fill: "none" },
  ],

  pencil: [
    { d: "M15.5 3.5a2.1 2.1 0 1 1 3 3L7.5 17.5 3 19l1.5-4.5L15.5 3.5z", fill: "currentColor", opacity: 0.1 },
    { d: "M15.5 3.5a2.1 2.1 0 1 1 3 3L7.5 17.5 3 19l1.5-4.5L15.5 3.5zM13 6l3 3", fill: "none" },
  ],

  search: [
    { d: "M10 19c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z", fill: "currentColor", opacity: 0.12 },
    { d: "M10 19c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9zM16.5 16.5l6.5 6.5", fill: "none" },
  ],

  "map-pin": [
    { d: "M12 1c-4.4 0-8 3.6-8 8 0 7 8 14 8 14s8-7 8-14c0-4.4-3.6-8-8-8z", fill: "currentColor", opacity: 0.15 },
    { d: "M12 1c-4.4 0-8 3.6-8 8 0 7 8 14 8 14s8-7 8-14c0-4.4-3.6-8-8-8zM12 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z", fill: "none" },
  ],

  chat: [
    { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z", fill: "currentColor", opacity: 0.1 },
    { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10zM8 9h8M8 13h6", fill: "none" },
  ],

  chart: [
    { d: "M4 20h16M6 16v-3M10 16V8m4 8v-4m4 4v-3", fill: "currentColor", opacity: 0.1 },
    { d: "M4 20h16M6 16v-3M10 16V8m4 8v-4m4 4v-3", fill: "none", strokeW: 1.6 },
  ],

  taste: [
    { d: "M12 3a6 6 0 0 0-6 6c0 4.4 6 12 6 12s6-7.6 6-12a6 6 0 0 0-6-6z", fill: "currentColor", opacity: 0.12 },
    { d: "M12 3a6 6 0 0 0-6 6c0 4.4 6 12 6 12s6-7.6 6-12a6 6 0 0 0-6-6zM10 9h4m-2-2v4", fill: "none" },
  ],

  coin: [
    { d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", fill: "currentColor", opacity: 0.1 },
    { d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 5a5 5 0 0 1 0 10M12 7a5 5 0 0 0 0 10M12 17v2M12 5V3", fill: "none" },
  ],

  leaf: [
    { d: "M5 22c2-3 4-6 4-10C9 7.6 5.4 4 1 4c0 4 1.2 7.5 4 9.5M17 2c0 6-4.5 12-10 14.5", fill: "currentColor", opacity: 0.12 },
    { d: "M5 22c2-3 4-6 4-10C9 7.6 5.4 4 1 4c0 4 1.2 7.5 4 9.5M17 2c0 6-4.5 12-10 14.5M14 6l4-4m-4 0h4v4", fill: "none" },
  ],

  lightning: [
    { d: "M13 2 4 13h6l-1 9 9-11h-6l1-9z", fill: "currentColor", opacity: 0.14 },
    { d: "M13 2 4 13h6l-1 9 9-11h-6l1-9z", fill: "none" },
  ],

  utensils: [
    { d: "M5 2v20M5 11h3.5a4 4 0 0 0 0-8H5M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 0v14", fill: "currentColor", opacity: 0.1 },
    { d: "M5 2v20M5 11h3.5a4 4 0 0 0 0-8H5M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 0v14", fill: "none" },
  ],

  phone: [
    { d: "M16 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z", fill: "currentColor", opacity: 0.1 },
    { d: "M16 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM12 17M10 5h4", fill: "none", strokeW: 1.5 },
  ],

  gear: [
    { d: "M12 1l2.5 3.3 4-.8.8 4 3.3 2.5-1.8 3.7 1.8 3.7-3.3 2.5-.8 4-4-.8L12 23l-2.5-3.3-4 .8-.8-4-3.3-2.5 1.8-3.7-1.8-3.7 3.3-2.5.8-4 4 .8z", fill: "currentColor", opacity: 0.1 },
    { d: "M12 1l2.5 3.3 4-.8.8 4 3.3 2.5-1.8 3.7 1.8 3.7-3.3 2.5-.8 4-4-.8L12 23l-2.5-3.3-4 .8-.8-4-3.3-2.5 1.8-3.7-1.8-3.7 3.3-2.5.8-4 4 .8zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", fill: "none" },
  ],

  logout: [
    { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", fill: "currentColor", opacity: 0.08 },
    { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9", fill: "none" },
  ],

  alert: [
    { d: "M12 2 1 22h22L12 2z", fill: "currentColor", opacity: 0.15 },
    { d: "M12 2 1 22h22L12 2zM12 9v5m0 3", fill: "none", strokeW: 1.6 },
  ],

  bowl: [
    { d: "M3 9h18M3 9c0 5 4 9 9 9s9-4 9-9", fill: "currentColor", opacity: 0.1 },
    { d: "M3 9h18M3 9c0 5 4 9 9 9s9-4 9-9M12 5v3m-2-2h4", fill: "none" },
  ],

  medal: [
    { d: "M7 3h10l-3.5 5.5 3.5 5.5H7l3.5-5.5L7 3z", fill: "currentColor", opacity: 0.1 },
    { d: "M7 3h10l-3.5 5.5 3.5 5.5H7l3.5-5.5L7 3zM9 14h6l1.5 7L12 18.5 7.5 21 9 14z", fill: "none" },
  ],

  "arrow-right": [
    { d: "M5 12h14M14 7l5 5-5 5", fill: "none" },
  ],

  check: [
    { d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", fill: "currentColor", opacity: 0.12 },
    { d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM7 12l3.5 3.5L17 9", fill: "none" },
  ],

  cross: [
    { d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", fill: "currentColor", opacity: 0.12 },
    { d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM8 8l8 8M16 8l-8 8", fill: "none" },
  ],

  info: [
    { d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", fill: "currentColor", opacity: 0.12 },
    { d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 17v-5m0-4", fill: "none", strokeW: 1.6 },
  ],

  edit: [
    { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M15 3.5a2.1 2.1 0 1 1 3 3L9 17l-4 1 1-4L15 3.5z", fill: "currentColor", opacity: 0.1 },
    { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M15 3.5a2.1 2.1 0 1 1 3 3L9 17l-4 1 1-4L15 3.5z", fill: "none" },
  ],

  "emoji-dizzy": [
    { d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", fill: "currentColor", opacity: 0.12 },
    { d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM7 8 9 6M9 8 7 6M15 8l2-2m-2 0 2 2M10 16h4", fill: "none" },
  ],

  trending: [
    { d: "M3 20V9l7 7 4-4 7 8z", fill: "currentColor", opacity: 0.1 },
    { d: "M3 20V9l7 7 4-4 7 8M21 8v5m0-5h-5", fill: "none" },
  ],

  clock: [
    { d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", fill: "currentColor", opacity: 0.12 },
    { d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2M5 3l2 2M19 3l-2 2", fill: "none" },
  ],
};

export function Icon({ name, size = 24, className }: IconProps) {
  const paths = ICONS[name];
  if (!paths) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0 select-none", className)}
      style={{ cursor: "default" }}
    >
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill={p.fill ?? "none"}
          fillOpacity={p.opacity}
          stroke={p.stroke ?? "currentColor"}
          strokeWidth={p.strokeW ?? 1.6}
        />
      ))}
    </svg>
  );
}
