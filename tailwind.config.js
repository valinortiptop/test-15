// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
      colors: {
        volt: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        neon: {
          green: "#39FF14",
          cyan:  "#00FFFF",
          blue:  "#0FF0FC",
        },
        navy: {
          950: "#020617",
          900: "#0a0f1e",
          800: "#0d1530",
          700: "#0f1f4a",
          600: "#122060",
        },
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #020617 0%, #0a0f1e 40%, #0d1a3a 70%, #071a12 100%)",
        "card-gradient": "linear-gradient(145deg, rgba(13,21,48,0.9) 0%, rgba(7,26,18,0.8) 100%)",
        "neon-glow": "linear-gradient(90deg, #39FF14 0%, #00FFFF 100%)",
      },
      boxShadow: {
        "neon-green": "0 0 20px rgba(57,255,20,0.4), 0 0 60px rgba(57,255,20,0.15)",
        "neon-cyan":  "0 0 20px rgba(0,255,255,0.4), 0 0 60px rgba(0,255,255,0.15)",
        "card":       "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float":      "float 6s ease-in-out infinite",
        "glow":       "glow 2s ease-in-out infinite alternate",
        "slide-up":   "slideUp 0.6s ease-out forwards",
        "fade-in":    "fadeIn 0.8s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-12px)" },
        },
        glow: {
          from: { textShadow: "0 0 10px rgba(57,255,20,0.5)" },
          to:   { textShadow: "0 0 25px rgba(57,255,20,0.9), 0 0 50px rgba(57,255,20,0.4)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};