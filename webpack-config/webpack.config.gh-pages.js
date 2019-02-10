const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const prodConfig = require('./webpack.config.prod.js');
const project = require('../project.config.js');
const { inProject } = require('../utils');

module.exports = merge(prodConfig, {
  output: {
    path: inProject('docs')
  },
  plugins: [
    new CleanWebpackPlugin(['docs'], { root: project.basePath }),
  ]
});
