import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 底色系 — 深焙咖啡调
        base: {
          900: "#100B08",
          800: "#1A1410",
          700: "#231D18",
          600: "#2D261F",
          500: "#3A3129",
        },
        // 纸面 — 暖奶油调 (用于卡片表面)
        paper: {
          50: "#FDF9F4",
          100: "#F8F0E5",
          200: "#F0E3D0",
          300: "#E5D3B8",
          400: "#D4BFA0",
          500: "#C4A888",
        },
        // 主色 — 赤陶/红土 (paprika terracotta)
        accent: {
          50: "#FDF2EE",
          100: "#F9DFD5",
          200: "#F2BFA9",
          300: "#E8996E",
          400: "#D97845",
          500: "#C75B39",
          600: "#A8472D",
          700: "#873624",
          800: "#66281C",
          900: "#451B13",
        },
        // 暖金 — 铜色/烛光
        gold: {
          50: "#FCF8F2",
          100: "#F7EDDD",
          200: "#EED8B5",
          300: "#E0BD85",
          400: "#D1A05A",
          500: "#C08A3F",
          600: "#A06F2E",
          700: "#7D5522",
          800: "#5A3D18",
          900: "#3A270F",
        },
        // 鼠尾草绿 (sage)
        sage: {
          50: "#F4F7F2",
          100: "#E5EDE0",
          200: "#CCDBC2",
          300: "#A9C599",
          400: "#85AD70",
          500: "#6B9451",
          600: "#557A3E",
          700: "#425F30",
          800: "#314823",
          900: "#213218",
        },
      },
      fontFamily: {
        sans: [
          '"PingFang SC"',
          '"Microsoft YaHei"',
          '"Hiragino Sans GB"',
          '"Noto Sans SC"',
          "system-ui",
          "sans-serif",
        ],
        serif: [
          '"Noto Serif SC"',
          '"Source Han Serif SC"',
          '"Songti SC"',
          "Georgia",
          "serif",
        ],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        display: ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(0,0,0,0.3)",
        soft: "0 2px 8px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)",
        medium: "0 4px 16px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.1)",
        strong: "0 8px 32px rgba(0,0,0,0.35), 0 3px 8px rgba(0,0,0,0.15)",
        glow: "0 0 24px rgba(199, 91, 57, 0.3)",
        "glow-gold": "0 0 20px rgba(208, 160, 90, 0.25)",
        card: "0 1px 3px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.03)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
