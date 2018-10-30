
//const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');


var webpack = require('webpack');


var LiveReloadPlugin = require('webpack-livereload-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');


const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "index.html"
});

module.exports = {
  entry: './src/components/search/index.js',
  output: {
    filename: 'watchfile.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './src/components/search/index.js',
    hot: true,
    open: true
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
  plugins: [
      htmlWebpackPlugin,
      new LiveReloadPlugin(
      {
        appendScriptTag: true
      }),
      new BrowserSyncPlugin(
      /*{
        host: 'localhost',
        port: 8080,
        proxy: 'http://localhost:8080/react_map/src/components/search/index.js'
      },*/
      {
        reload: true
      }),
      new BundleAnalyzerPlugin(),
      new LodashModuleReplacementPlugin({
        'collections': true,
        'paths': true,
        'shorthands': true
      })
  ]
};
