/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
extend: {
      colors: {
        primary: "#6B46C1",
        secondary: "#EC4899",
        accent: "#F59E0B",
        surface: "#1F2937",
        background: "#111827",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
        premium: {
          start: "#667eea",
          end: "#764ba2",
          light: "#8b9cf9",
          dark: "#5a67d8"
        }
      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      backgroundImage: {
        'aurora': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-aurora': 'linear-gradient(to right, #6B46C1, #EC4899, #F59E0B)',
        'gradient-card': 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
      },
    },
  },
  plugins: [],
}