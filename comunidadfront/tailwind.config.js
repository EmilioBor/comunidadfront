/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",  // IMPORTANTE
  ],
  theme: {
    extend: {
      keyframes: {
        "scroll-step": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
      },
      animation: {
        "scroll-step": "scroll-step linear infinite",
      },
    },
  },
};