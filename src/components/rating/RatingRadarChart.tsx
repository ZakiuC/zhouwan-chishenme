"use client";

import { RATING_DIMENSIONS } from "@/lib/constants";

interface RadarChartProps { data: Record<string, number>; size?: number; }

export function RatingRadarChart({ data, size = 200 }: RadarChartProps) {
  const cx = size / 2, cy = size / 2, radius = size * 0.35, levels = 5;
  const angles = RATING_DIMENSIONS.map((_,i) => (Math.PI * 2 * i) / RATING_DIMENSIONS.length - Math.PI / 2);
  const toCart = (angle: number, r: number) => ({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });

  const grids = Array.from({length: levels}, (_, lv) => {
    const r = radius * ((lv + 1) / levels);
    return angles.map(a => toCart(a, r)).map(p => `${p.x},${p.y}`).join(" ");
  });

  const dataPts = angles.map((a, i) => toCart(a, radius * ((data[RATING_DIMENSIONS[i].key] ?? 0) / 5)));
  const dataPoly = dataPts.map(p => `${p.x},${p.y}`).join(" ");

  const axes = angles.map(a => { const e = toCart(a, radius); return { x1: cx, y1: cy, x2: e.x, y2: e.y }; });

  const labels = angles.map((a, i) => {
    const pos = toCart(a, radius + 18);
    let anchor: "start"|"middle"|"end" = "middle";
    if (Math.abs(pos.x - cx) > 5) anchor = pos.x < cx ? "end" : "start";
    return { ...pos, text: RATING_DIMENSIONS[i].label, anchor };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="mx-auto select-none">
      {grids.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke={i === levels-1 ? "#3A3129" : "#2D261F"} strokeWidth={i === levels-1 ? 1.5 : 0.5} />
      ))}
      {axes.map((a, i) => <line key={i} {...a} stroke="#2D261F" strokeWidth="0.5" />)}
      <polygon points={dataPoly} fill="rgba(199,91,57,0.12)" stroke="#C75B39" strokeWidth="2" strokeLinejoin="round" />
      {dataPts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#C75B39" />)}
      {labels.map((l, i) => (
        <text key={i} x={l.x} y={l.y} textAnchor={l.anchor} dominantBaseline="middle" className="fill-paper-500" style={{ fontSize: "10px" }}>{l.text}</text>
      ))}
    </svg>
  );
}
