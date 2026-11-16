/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        guardian: {
          950: '#070b14',
          900: '#0c1322',
          850: '#111b2e',
          800: '#17233c',
          700: '#213150',
          600: '#324a73',
          500: '#46669d',
        },
        electric: {
          blue: '#0066ff',
          cyan: '#00f0ff',
        }
      },
      fontFamily: {
        sans: ['Segoe UI Variable', 'Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(0, 240, 255, 0.35)',
        'glow-blue': '0 0 30px rgba(0, 102, 255, 0.4)',
      }
    },
  },
  plugins: [],
}
