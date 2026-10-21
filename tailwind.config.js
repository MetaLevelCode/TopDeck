/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // Hover styles only apply on devices that can hover, so taps never leave a stuck :hover.
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        base: {
          dark: '#2C1E16', // Dark Roast: fondo principal
          mocha: '#3E2723', // Mocha Brown: superficies elevadas
        },
        accent: {
          clay: '#C55A3F', // CTAs primarios
          brick: '#A2412A', // hover / bordes de acento
          botanical: '#4A7C59', // CTAs secundarios, éxito
          sage: '#689F77', // highlights
        },
        ui: {
          parchment: '#F1E8D9', // texto principal
          latte: '#BCAAA4', // texto secundario
          cocoa: '#795548', // bordes
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Quicksand', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        jrpg: '12px',
      },
      boxShadow: {
        panel: '0 3px 0 #1A120E, 0 12px 24px -10px rgba(0, 0, 0, 0.55)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.02)' },
        },
      },
      animation: {
        breathe: 'breathe 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
