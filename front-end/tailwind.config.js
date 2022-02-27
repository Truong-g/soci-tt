module.exports = {
  content: [
    // Example content paths...
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    screens: {
      'sm': {'max': '640px'},

      'md': {'min': '640px' ,'max': '1024px'},

      'lg': {'min': '1024px' ,'max': '1208px'},

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    fontWeight:{
      weightMain: "500"
    },
    extend: {
      colors: {
        "main-color": "#1A2DF1",
        "main-color-dim": "#1A2DF130"
      },
      keyframes: {
        fadeIn1: {
          '0%': { transform: 'translateX(-100%)', opacity: "0" },
          '100%': { transform: 'translateX(0)', opacity: "1" },
        },
        fadeIn2: {
          '0%': { transform: 'translateX(100%)', opacity: "0" },
          '100%': { transform: 'translateX(0)', opacity: "1" },
        },
      },
      animation: {
        fadeIn1: 'fadeIn1 ease-in-out 0.3s',
        fadeIn2: 'fadeIn2 ease-in-out 0.3s',

      }
    },
  },
  plugins: [],
}
