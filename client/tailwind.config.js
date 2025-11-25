/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Remove 'darkMode' or set to 'class' - doesn't matter if we hardcode colors
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#dc2626",
        secondary: "#f59e0b",
        // Force BOTH light and dark variables to be black
        "background-light": "#2e2e2e", 
        "background-dark": "#2e2e2e",
      },
      fontFamily: {
        display: ["Roboto", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
      },
    },
  },
  plugins: [],
}