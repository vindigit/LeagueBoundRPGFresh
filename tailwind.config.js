/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        premium: {
          bg: "#090B10",
          surface: "#111827",
          surfaceAlt: "#1F2937",
          accent: "#D4AF37",
          muted: "#94A3B8",
        },
      },
    },
  },
  plugins: [],
};
