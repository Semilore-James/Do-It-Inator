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
        navy: "#0B1D51",
        purple: "#725CAD",
        skyblue: "#8CCDEB",
        cream: "#FFE3A9",
      },
      boxShadow: {
        brutal: "8px 8px 0px #725CAD",
        "brutal-hover": "12px 12px 0px #725CAD",
        "brutal-active": "4px 4px 0px #725CAD",
      },
      borderWidth: {
        brutal: "4px",
      },
    },
  },
  plugins: [],
};
export default config;
