/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // Hover styles only apply on devices that can hover, so taps never leave a stuck :hover.
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      // DESIGN.md · Warm Parchment Lounge. Los tonos `ink` oscurecen el acento para que el texto pase AA (≥4.5:1) en todas las superficies.
      colors: {
        parchment: {
          DEFAULT: '#FBF5EB', // lienzo de la página
          raised: '#FFFDF9', // tarjetas, cajones y hojas modales
          card: '#F3E9D7', // contenedores teñidos, botón secundario
          deep: '#E9DCBF', // hover del secundario
          well: '#F3ECE0', // campos y huecos hundidos
          sand: '#EFE5D5', // chips neutros
          line: '#EAD9C4', // borde de capas flotantes
        },
        honey: {
          DEFAULT: '#F29F38', // primario: CTAs, indicadores activos
          tint: '#FEF3E2',
          deep: '#D97706', // hover del primario
          ink: '#A14A08', // texto en acento
        },
        espresso: {
          DEFAULT: '#382414', // texto principal, trazos
          soft: '#534436', // texto secundario
          mute: '#75624F', // texto terciario, separadores
        },
        moss: { DEFAULT: '#4A7C59', ink: '#3B6A4A' }, // éxito, legal, stock
        ember: { DEFAULT: '#C84C32', ink: '#AB3A22' }, // error, agotado, ilegal
      },
      fontFamily: {
        display: ['Caprasimo', 'Georgia', 'serif'],
        body: ['"Alegreya Sans"', 'system-ui', 'sans-serif'],
        serif: ['Alegreya', 'Georgia', 'serif'],
      },
      // Sombras de papel apilado: un filo nítido abajo en vez de un halo difuso.
      boxShadow: {
        rest: '0 1px 0 rgba(56, 36, 20, 0.1)',
        lift: '0 2px 0 rgba(56, 36, 20, 0.12), 0 12px 24px -16px rgba(56, 36, 20, 0.35)',
        float: '0 24px 48px -20px rgba(56, 36, 20, 0.4)',
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
