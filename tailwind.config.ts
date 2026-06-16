import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F1419",
        panel: "#171F27",
        panel2: "#1C2530",
        parchment: "#EDE6D6",
        "parchment-dim": "#9C9484",
        gold: "#D4A24C",
        "gold-dim": "#8A6A33",
        evidence: "#6FA89B",
        hairline: "#2A323B",
      },
      fontFamily: {
        display: ["Iowan Old Style", "Palatino Linotype", "Georgia", "serif"],
        body: ["ui-sans-serif", "system-ui", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SF Mono", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
