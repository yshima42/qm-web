import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config = {
  darkMode: false,
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../packages/utils/src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "#2E6C28", // ライトモードの時のメインカラー
          dark: "#78DC77", // ダークモードの時のメインカラー
          50: "#f0f7ef",
          100: "#d8ecd5",
          200: "#b0d8ac",
          300: "#89c283",
          400: "#5ca954",
          500: "#3E8E34",
          600: "#2E6C28", // light と同じ値
          700: "#255520",
          800: "#1c4018",
          900: "#132c10",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["var(--font-noto-sans-jp)", "sans-serif"],
        // 必要に応じて他のフォントファミリーも追加できます
        display: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [animate],
  // Tailwind CSS v4用設定
  future: {
    respectDefaultRingColorOpacity: true,
    disableColorOpacityUtilitiesByDefault: true,
    enableTransitionableRelativeColors: true,
  },
} satisfies Config;

export default config;
