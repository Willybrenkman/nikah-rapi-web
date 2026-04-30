/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'ivory': 'var(--ivory)',
        'rose-gold': 'var(--rose-gold)',
        'rose-dark': 'var(--rose-dark)',
        'dusty-pink': 'var(--dusty-pink)',
        'sage': 'var(--sage)',
        'brown-main': 'var(--brown)',
        'brown-muted': 'var(--brown-muted)',
        'brown-light': 'var(--dusty-pink)',
        'border-soft': 'var(--border)',
        'surface': 'var(--ivory)',
        'danger': 'var(--danger)',
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