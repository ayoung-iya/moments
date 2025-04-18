import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        top: "0 -5px 10px -6px rgba(0,0,0,.1)",
        "t-border": "inset 0 1px rgb(229, 231, 235)",
      },
    },
  },
  plugins: [],
} satisfies Config;
