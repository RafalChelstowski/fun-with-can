module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        tViolet: '#6d3979',
        tGreen: '#75ab4f',
      },
      // fontFamily: {
      //   sans: [
      //     'Nunito Sans',
      //     'Lato',
      //     'Arial',
      //     'sans-serif',
      //     'Lato',
      //     'Arial',
      //     'sans-serif',
      //   ],
      // },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
