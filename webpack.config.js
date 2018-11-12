var webpack = require('webpack');
//const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

var LiveReloadPlugin = require('webpack-livereload-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const plugins = []

plugins.push(new HtmlWebPackPlugin({
  inject: true,
  template: path.resolve(__dirname, './application/views/index.php')
  }),
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
)

plugins.push(
  new LiveReloadPlugin(
  {
    appendScriptTag: true
  }),
 /* new BrowserSyncPlugin(
  {
    host: 'localhost',
    port: 8080,
    proxy: 'http://localhost:8080/ingles-app-ci3/dashboard/v2/backup'
  },
  {
    reload: false
  }),*/
  new BundleAnalyzerPlugin(),
  new LodashModuleReplacementPlugin({
    'collections': true,
    'paths': true,
    'shorthands': true
  })
);

module.exports = {
  entry: './src/containers/markers/index.js',
  output: {
    filename: 'watchfile.bundle.js',
    path: path.resolve(__dirname, 'src/build'),
    publicPath: __dirname + '/src/build'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[name]_[local]_[hash:base64]",
              sourceMap: true,
              minimize: true
            }
          }
        ]
      }
    ]
  },
  plugins: plugins
};