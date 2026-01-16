/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ea2a33",
        "primary-dark": "#c91f27",
        "background-light": "#ffffff",
        "background-alt": "#f9fafb",
        "background-dark": "#111827",
        "background-dark-alt": "#1f2937",
        "text-main": "#111827",
        "text-muted": "#6b7280",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        full: "9999px"
      },
      boxShadow: {
        premium: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
        "premium-hover": "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
