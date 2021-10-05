/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  webpack: {
    resolve: {
      alias: {
        react: path.resolve('./node_modules/react'),
      },
    },
  },
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  jest: {
    configure: {
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      transform: {
        'node_modules/variables/.+\\.(j|t)sx?$': 'ts-jest',
      },
      transformIgnorePatterns: ['node_modules/(?!variables/.*)'],
      globals: {
        window: {},
      },
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
      testPathIgnorePatterns: ['<rootDir>/cypress/'],
    },
  },
};
