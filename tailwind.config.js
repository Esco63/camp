/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        rosa: '#ec4899',
        graumetallic: '#2a2a2a',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out both',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 10px #ec4899',
          },
          '50%': {
            boxShadow: '0 0 25px #ec4899',
          },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
      },
      dropShadow: {
        'glow': '0 0 10px rgba(236, 72, 153, 0.6)',
        'strong-glow': '0 0 25px rgba(236, 72, 153, 0.8)',
      },
      backgroundImage: {
        'hero-booking': "url('/src/assets/images/buchung.png')",
      },
    },
  },
  plugins: [],
}
