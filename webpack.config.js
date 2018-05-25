const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const yaml = require('js-yaml');
const fs = require('fs');
const Config = yaml.safeLoad(fs.readFileSync(`${__dirname}/api/env.yml`, 'utf8'));

module.exports = {
  entry: [
    __dirname + '/src/js/app.js'
  ],
  output: {
    path: __dirname + '/www',
    filename: 'js/app.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: __dirname + '/www/index.html',
      template: __dirname + '/src/index.html',
      hash: true,
    }),
    new ExtractTextPlugin({
      filename: 'css/style.css'
    }),
    new webpack.DefinePlugin({
      'process.env.DEV': true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.apiPath': Config.apigateway.endpoint,
    }),
  ],
  resolve: {
    extensions: ['.js', '.vue'],
  },
  externals: [
    {
      device: true,
    },
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(vue|js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?minimize', 'sass-loader'],
        }),
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/,
        loaders: 'url-loader',
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        loader: 'url-loader',
        include: __dirname + '/node_modules/material-design-icons-iconfont',
      },
    ],
  },
  devServer: {
    host: 'localhost',
    contentBase: __dirname + '/www',
    port: 4000,
    headers: { 'Access-Control-Allow-Origin': '*' },
    disableHostCheck: true,
  },
};