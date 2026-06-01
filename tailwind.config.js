export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      colors: {
        cream: '#F2EDE4',
        teal: {
          DEFAULT: '#2A9D8F',
          dark: '#1B7A6E',
        },
        ink: '#1A1A1A',
      },
    },
  },
  plugins: [],
};