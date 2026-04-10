/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brown: {
          50:  '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#65443c',
          900: '#271816',
        },
        cream: '#faf7f5',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft:         '0 2px 12px 0 rgba(101,68,60,0.08)',
        card:         '0 4px 24px 0 rgba(101,68,60,0.10)',
        'card-hover': '0 8px 32px 0 rgba(101,68,60,0.16)',
      },
      keyframes: {
        slideInRight: {
          '0%':   { transform: 'translateX(calc(100% + 1.25rem))', opacity: '0' },
          '100%': { transform: 'translateX(0)',                     opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        slideInRight: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        fadeIn:       'fadeIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
