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
        // neutral token used for all borders, backgrounds, muted text
        border:  '#E5E7EB',
        surface: '#F9FAFB',
        cream:   '#F9FAFB',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft:         'none',
        card:         'none',
        'card-hover': 'none',
      },
      borderRadius: {
        // tighten radius scale — keep existing names but cap values
        DEFAULT: '6px',
        sm:  '4px',
        md:  '6px',
        lg:  '8px',
        xl:  '8px',
        '2xl': '10px',
        full: '9999px',
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
        slideInRight: 'slideInRight 0.2s ease-out',
        fadeIn:       'fadeIn 0.15s ease-out',
      },
    },
  },
  plugins: [],
}
