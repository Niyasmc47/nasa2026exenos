/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030712',
          900: '#060d1f',
          850: '#09132b',
          800: '#0e1b38',
          700: '#16284f',
          600: '#1f386d',
        },
        lunar: {
          surface: '#121824',
          border: '#1e293b',
          glow: '#38bdf8',
          cyan: '#06b6d4',
          highlight: '#38bdf8',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
