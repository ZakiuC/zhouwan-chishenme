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
        ink: {
          DEFAULT: "#080604",
          50: "#F5F0E8",
          100: "#EBE3D6",
          200: "#D6C8B3",
          300: "#B8A58A",
          400: "#9A8266",
          500: "#7A654E",
          600: "#5C4B3A",
          700: "#3D3026",
          800: "#1F1813",
          900: "#0E0A07",
          950: "#080604",
        },
        // 单色强调 — 焦糖琥珀
        caramel: {
          DEFAULT: "#D4784C",
          50: "#FCF3EC",
          100: "#F8E3D4",
          200: "#F0C4A5",
          300: "#E8A276",
          400: "#DE7F4B",
          500: "#D4784C",
          600: "#B55D34",
          700: "#8F4525",
          800: "#692F18",
          900: "#421D0E",
        },
        // 鼠尾草 — 评分/成功
        sage: {
          DEFAULT: "#7B9E6D",
          50: "#F4F7F2",
          100: "#E5EDE0",
          200: "#CCDBC2",
          300: "#A9C599",
          400: "#8CAD78",
          500: "#7B9E6D",
          600: "#608151",
          700: "#49633E",
          800: "#334528",
          900: "#1D2716",
        },
        // 胆红 — 删除/警告
        rust: {
          DEFAULT: "#C4554D",
          50: "#FCF4F3",
          100: "#F7E2E0",
          200: "#EFC3BE",
          300: "#E39E97",
          400: "#D6756B",
          500: "#C4554D",
          600: "#A43E37",
          700: "#7E2F29",
          800: "#571F1B",
          900: "#31110F",
        },
      },
      fontFamily: {
        sans: [
          '"PingFang SC"',
          '"Microsoft YaHei"',
          '"Hiragino Sans GB"',
          "system-ui",
          "sans-serif",
        ],
        display: [
          '"PingFang SC"',
          '"Microsoft YaHei"',
          '"Hiragino Sans GB"',
          "system-ui",
          "sans-serif",
        ],
        mono: [
          '"SF Mono"',
          '"Cascadia Code"',
          '"Fira Code"',
          "monospace",
        ],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        xs: ["0.75rem", { lineHeight: "1.125rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.625rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }],
        "2xl": ["1.5rem", { lineHeight: "1.875rem", letterSpacing: "-0.02em" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.025em" }],
        "4xl": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "700" }],
        "5xl": ["3.5rem", { lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "800" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        none: "none",
        lift: "0 0 0 1px rgba(255,255,255,0.03), 0 1px 3px rgba(0,0,0,0.5)",
        card: "0 0 0 1px rgba(212,120,76,0.08), 0 2px 8px rgba(0,0,0,0.4)",
        "card-hover": "0 0 0 1px rgba(212,120,76,0.15), 0 4px 20px rgba(0,0,0,0.5), 0 0 40px rgba(212,120,76,0.05)",
        intense: "0 0 0 1px rgba(212,120,76,0.2), 0 8px 32px rgba(0,0,0,0.6), 0 0 60px rgba(212,120,76,0.08)",
      },
      letterSpacing: {
        widest: "0.2em",
      },
      transitionTimingFunction: {
        snap: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
