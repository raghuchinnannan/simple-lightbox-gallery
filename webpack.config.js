// webpack.config.js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: './src/simple-lightbox-gallery.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'simple-lightbox-gallery.js',
    library: {
      name: 'SimpleLightboxGallery',
      type: 'umd',
      export: 'default',
    },
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'simple-lightbox-gallery.css',
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'demo'),
    },
    compress: true,
    port: 9000,
  },
};