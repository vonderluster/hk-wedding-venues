/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fdf5f6",
          100: "#fbe8eb",
          200: "#f5cfd6",
          300: "#eda8b4",
          400: "#e07a8c",
          500: "#d15670",
          600: "#b93d59",
          700: "#962f48",
          800: "#7a2a3f",
          900: "#66273a",
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
