/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617', // Slate 950
        surface: '#0f172a',    // Slate 900
        primary: '#3b82f6',    // Blue 500
        secondary: '#6366f1',  // Indigo 500
        accent: '#8b5cf6',     // Violet 500
        success: '#10b981',    // Emerald 500
        warning: '#f59e0b',    // Amber 500
        danger: '#ef4444',     // Red 500
        dark: {
          900: '#020617',
          800: '#0f172a',
          700: '#1e293b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scroll': 'scroll 20s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [],
}
