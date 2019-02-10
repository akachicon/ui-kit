const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const project = require('../project.config.js');
const { inProject, inProjectSrc } = require('../utils');

/* eslint-disable */
const __DEV__ = project.env === 'development';
const __PROD__ = project.env === 'production';

const postCssPlugins = __PROD__ ? [
  require('autoprefixer')({}),
  require('cssnano')({})
] : [];
/* eslint-enable */

module.exports = {
  context: inProjectSrc(''),
  entry: {
    main: [
      inProjectSrc(project.bootstrap),
      inProjectSrc(project.main)
    ]
  },
  output: {
    path: inProject(project.outDir),
    publicPath: project.publicPath
  },
  resolve: {
    extensions: ['*', '.js', '.json', '.css', '.scss']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // cacheDirectory: __DEV__,
            }
          }
        ]
      },
      {
        test: /\.pug$/,
        use: ['pug-loader']
      },
      {
        test: /\.(css|scss)$/,
        use: [
          __PROD__ ? MiniCssExtractPlugin.loader : {
            loader: 'style-loader',
            options: {
              singleton: true,
              hmr: __DEV__
            }
          },
          {
            loader: 'css-loader',
            options: {
              localIdentName: `${project.main.production}--[hash:base64:10]`,
              importLoaders: 2
            }
          },
          'resolve-url-loader', // sourceMap option must be used in following loaders in order to get this loader to work
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: postCssPlugins,
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /[\\/]fonts[\\/].+\.(ttf|otf|woff|svg)$/,
        loader: 'file-loader',
        options: {
          publicPath: (url) => {
            if (process.env.WP_BUILD === 'gh-pages') {
              return `/${url}`;
            }

            return url;
          }
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[name][hash:8].[ext]',
          outputPath: 'img'
        }
      }
    ]
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      minSize: 0,
      maxSize: Infinity,
      name: true,
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 1,
          enforce: true,
          priority: 5
        },
        shim: {
          test: /[\\/](core-js|regenerator-runtime|@babel)[\\/]/,
          minChunks: 1,
          enforce: true,
          priority: 10
        },
        style: {
          name: 'style',
          test: /\.(css|scss)$/,
          minChunks: 1,
          enforce: true,
          priority: 15
        }
      }
    },
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], { root: project.basePath }),
    new HtmlWebpackPlugin({
      inlineSource: 'runtime',
      filename: project.html.output.filename,
      template: inProjectSrc(project.html.template),
      templateParameters: project.html.templateParameters
    }),
    new WebappWebpackPlugin({
      logo: inProjectSrc('blocks', 'root', 'favicon.png'),
      prefix: 'favicons/',
      cache: true,
      favicons: {
        appName: project.html.title,
        developerName: null,
        developerURL: null, // prevent retrieving from the nearest package.json
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          windows: false,
          yandex: false
        }
      }
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new MiniCssExtractPlugin({
      filename: __DEV__ ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: __DEV__ ? '[id].css' : '[id].[contenthash].css',
    }),
    new webpack.DefinePlugin(project.globals)
  ]
};
