/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./buchung/index.html",
    "./geraete.html",       // NEU
    "./src/**/*.{js,ts,jsx,tsx}",
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
      spacing: {
        '72': '18rem', // Für größere Container-Breiten
        '96': '24rem', // Optional: für noch mehr Abstände
      },
      gridTemplateColumns: {
        'custom-3': 'repeat(3, minmax(0, 1fr))', // Für maßgeschneiderte 3-Spalten-Layouts
      },
      width: {
        '300px': '300px', // Feste Breite für Karten
        '350px': '350px', // Breitere Karten (optional)
      },
      maxWidth: {
        '7xl': '80rem', // Maximale Breite des Containers
      },
      spacing: {
        // Hier den horizontalen Abstand zwischen den Karten festlegen
        'gap-x-custom': '1.5rem',  // 1.5rem (24px) horizontaler Abstand zwischen den Karten
        'gap-y-custom': '1rem',    // 2rem (32px) vertikaler Abstand zwischen den Karten
      },
    },
  },
  plugins: [],
}
