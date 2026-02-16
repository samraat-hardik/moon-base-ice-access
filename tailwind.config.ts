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
        lunar: {
          surface: "#2c2c2e",
          shadow: "#1a1a1c",
          ice: "#7dd3fc",
          highlight: "#fcd34d",
        },
      },
    },
  },
  plugins: [],
};
export default config;
