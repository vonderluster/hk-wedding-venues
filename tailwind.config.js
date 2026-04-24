/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm parchment used for page-level structure (header, sidebar shells)
        cream: "#F8F3EC",
        // Accent palette: deep espresso brown → warm tan highlights
        // (replaces the old pink/fuchsia blush scale)
        blush: {
          50:  "#FBF7F3",
          100: "#F4ECE3",
          200: "#E8D6C4",
          300: "#D4B898",
          400: "#BA9468",
          500: "#9A7248",
          600: "#7A5232",   // primary CTA — deep warm brown
          700: "#623F24",
          800: "#4A2E16",
          900: "#30200C",
        },
      },
      fontFamily: {
        display: ['"Cactus Classical Serif"', "Georgia", "serif"],
        sans:    ['"Montserrat"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
