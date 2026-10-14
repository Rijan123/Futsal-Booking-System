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
        background: "#080D12",
        sidebar: "#0B1118",
        card: "#101820",
        elevated: "#16212B",
        accent: "#A3FF3F",
        "accent-secondary": "#4ADE80",
        "text-primary": "#F8FAFC",
        "text-secondary": "#94A3B8",
        border: "#263442",
        pending: "#FBBF24",
        cancelled: "#F87171",
        maintenance: "#A78BFA",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 200ms ease",
      },
    },
  },
  plugins: [],
};
export default config;
