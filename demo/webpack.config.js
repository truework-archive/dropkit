const webpack = require('webpack')
const path = require('path')
const ExtractCSS = require('mini-css-extract-plugin')
const p = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'index.js',
    libraryTarget: 'umd',
    publicPath: '/'
  },
  mode: p ? 'production' : 'development',
  target: 'web',
  performance: { hints: false },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                '@babel/plugin-syntax-object-rest-spread',
                ['@babel/plugin-transform-runtime',
                  { regenerator: true }
                ],
                'module:fast-async',
              ],
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          p && ExtractCSS.loader,
          !p && 'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('postcss-import'),
                require('postcss-nested'),
                require('postcss-cssnext')({
                  warnForDuplicates: false,
                  warnForDeprecations: false
                }),
                require('postcss-discard-comments'),
              ]
            }
          }
        ].filter(Boolean)
      },
    ]
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  plugins: [
    p && new ExtractCSS({ filename: 'index.css' }),
    !p && new webpack.HotModuleReplacementPlugin()
  ].filter(Boolean),
  devServer: {
    hot: true,
    contentBase: path.join(__dirname, 'static'),
    publicPath: '/'
  }
}
