import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#dc2626", // Red for dashboard
        secondary: "#f59e0b", // Yellow for login
        "background-light": "#f8fafc",
        "background-dark": "#020617",
      },
      fontFamily: {
        display: ["Roboto", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
      },
    },
  }
})
