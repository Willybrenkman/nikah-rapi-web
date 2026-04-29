/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'ivory': '#FDFAF6',
        'rose-gold': '#C9956C',
        'rose-dark': '#b07d55',
        'dusty-pink': '#E8C4B8',
        'sage': '#8BAF8B',
        'brown-main': '#2C1810',
        'brown-muted': '#9B8070',
        'brown-light': '#E8C4B8',
        'border-soft': '#F0E6DF',
        'surface': '#FAF4F0',
        'danger': '#D4756B',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        dm: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(44,24,16,0.06)',
        card: '0 4px 20px rgba(44,24,16,0.08)',
        modal: '0 20px 60px rgba(44,24,16,0.12)',
      },
    },
  },
  plugins: [],
}