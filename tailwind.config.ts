import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: "#008080",
        ink: "#172026",
        mist: "#eef7f7"
      },
      boxShadow: {
        soft: "0 10px 28px rgba(16, 24, 40, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
