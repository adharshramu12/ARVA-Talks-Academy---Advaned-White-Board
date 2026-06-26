import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Arva Talks Academy brand palette (from the logo)
        arva: {
          black: "#0a0a0b",
          panel: "#141417",
          edge: "#26262b",
          gold: "#F5B82E",
          goldsoft: "#FBD06B",
          silver: "#C9CDD6",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(245, 184, 46, 0.25)",
        panel: "0 8px 40px rgba(0, 0, 0, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
