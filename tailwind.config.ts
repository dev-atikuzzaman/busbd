import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: "#EAF5F3",
          100: "#CFE8E3",
          500: "#0F766E",
          600: "#0C5F59",
          700: "#0A4C47",
          900: "#07332F",
        },
        coral: {
          50: "#FFF1EA",
          100: "#FFDDC8",
          400: "#FC9361",
          500: "#FB7A3C",
          600: "#E8611F",
        },
        sun: {
          100: "#FFF3C4",
          400: "#FFC93C",
          500: "#F5B800",
        },
        ink: {
          50: "#F6F8F7",
          100: "#EAEFEC",
          400: "#5C6D68",
          600: "#324542",
          900: "#1A2E2B",
        },
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "Noto Sans Bengali", "sans-serif"],
        body: ["var(--font-inter)", "Noto Sans Bengali", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 2px 16px -4px rgba(10, 76, 71, 0.12)",
        lift: "0 8px 28px -6px rgba(251, 122, 60, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
