import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        bazar: {
          primary: "#05893e", "primary-content": "#ffffff",
          secondary: "#1a9951", accent: "#16a34a", neutral: "#1d271f",
          "base-100": "#ffffff", "base-200": "#f0f5f0", "base-300": "#e1e8e1", "base-content": "#1d271f",
          success: "#1a9951", error: "#d03739",
        },
      },
    ],
  },
};
export default config;
