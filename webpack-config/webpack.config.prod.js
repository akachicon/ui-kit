const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const MinifyJSPlugin = require('babel-minify-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const project = require('../project.config.js');
const baseConfig = require('./webpack.config.base.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: false,
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js'
  },
  // This to hide 'WARNING in asset size limit: The following asset(s)
  // exceed the recommended size limit (244 KiB).'
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new CompressionPlugin({
      test: /(vendor~|shim~|\.ttf|\.otf|\.woff|\.svg)/
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.resolve(project.basePath, 'bundle-report.html')
    })
  ],
  optimization: {
    noEmitOnErrors: false,
    minimize: false, // true,
    minimizer: [
      new MinifyJSPlugin(
        {
          mangle: { topLevel: true },
        }
      )
    ]
  }
});
