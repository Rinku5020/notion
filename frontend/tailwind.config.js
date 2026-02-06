export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        notion: {
          50: '#f7f7f5',
          100: '#efefed',
          200: '#e2e2de',
          300: '#cfcfca',
          400: '#b7b7b0',
          500: '#8f8f87',
          600: '#6e6e66',
          700: '#55554f',
          800: '#3f3f3a',
          900: '#2d2d29'
        }
      }
    },
  },
  plugins: [],
};
