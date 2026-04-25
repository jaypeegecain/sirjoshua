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
          DEFAULT: '#FF6B4A',
          container: '#FF5625',
          on: '#601400',
          'on-container': '#541100',
        },
        secondary: {
          DEFAULT: '#B8C8DA',
          container: '#394857',
        },
        tertiary: {
          DEFAULT: '#A5C8FF',
          container: '#2592FF',
        },
        surface: {
          DEFAULT: '#111111',
          dim: '#111111',
          bright: '#363636',
          'container-lowest': '#0C0C0C',
          'container-low': '#1A1A1A',
          container: '#1E1E1E',
          'container-high': '#282828',
          'container-highest': '#333333',
        },
        'on-surface': {
          DEFAULT: '#E5E2E3',
          variant: '#C2C7CE',
        },
        outline: {
          DEFAULT: '#8C9199',
          variant: '#42474E',
        },
        error: {
          DEFAULT: '#FFB4AB',
          container: '#93000A',
          on: '#690005',
          'on-container': '#FFDAD6',
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        headline: ["Space Grotesk", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
      },
    },
  },
  plugins: [],
}
