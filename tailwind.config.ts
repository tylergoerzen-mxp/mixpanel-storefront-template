import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mixpanel-ish purple accent so the demo feels on-brand.
        brand: {
          DEFAULT: "#7856FF",
          dark: "#5a3fd6",
          light: "#efeaff",
        },
      },
    },
  },
  plugins: [],
};

export default config;
