/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
    animation: {
      fade: "fadeIn 2s infinite",
      icon: "icon 5s ease infinite",
    },
    keyframes: {
      fadeIn: {
        "0%": { opacity: 0 },
        "50%": { opacity: 1 },
        "100%": { opacity: 0 },
      },
      icon: {
        "0%, 100%": {
          "background-color": "#B564B6",
        },
        "50%": {
          "background-color": "#93dfca",
        },
      },
    },
  },
  plugins: [],
};