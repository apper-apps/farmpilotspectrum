/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ec',
          100: '#dcedcf',
          500: '#2D5016',
          600: '#234012',
          700: '#1a300e',
          800: '#11200a',
          900: '#081006'
        },
        secondary: {
          50: '#f3f9e9',
          100: '#e3f2d3',
          500: '#7CB342',
          600: '#689935',
          700: '#547328',
          800: '#404d1b',
          900: '#2c330e'
        },
        accent: {
          50: '#fff3e0',
          100: '#ffe0b3',
          500: '#FF6F00',
          600: '#e55c00',
          700: '#cc4900',
          800: '#b33600',
          900: '#992300'
        },
        surface: '#F5F5DC',
        background: '#FAF8F3'
      }
    },
  },
  plugins: [],
}