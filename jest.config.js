/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-var-requires */
const craco = require('@craco/craco');

const cracoConfig = require('./craco.config.js');

const jestConfig = craco.createJestConfig(cracoConfig);

module.exports = jestConfig;
