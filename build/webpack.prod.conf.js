const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const chalk = require('chalk')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const TerserJSPlugin = require('terser-webpack-plugin')
const config = require('./config')
// const SentryPlugin = require('@sentry/webpack-plugin');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

function subPath (_path) {
  return path.posix.join(config[process.env.BUILD_ENV].SUB_DIR, _path)
}

const plugins = [
  new MiniCssExtractPlugin({
    filename: subPath('css/[name].css'),
    chunkFilename: subPath('css/[name].[contenthash:8].css')
  }),
  new CleanWebpackPlugin(['dist'], {
    root: resolve('/'),
    verbose: true
  }),
  new ProgressBarPlugin({
    format:
      '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)'
  })
]

if (config.buildDetail) {
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerPort: 8899
    })
  )
}
// if (process.env.NODE_ENV === 'development') {
//   console.log('-----------------------------sentryplugins-------------------')
//   plugins.push(
//     new SentryPlugin({
//       organization: 'sentry',
//       project: 'mp-wap',
//       apiKey: '7b4bac5f85ff43c1ab8ae14cc866980a5b843fe3c9b14cfc9477a79dbf94a427',
//       ignore: ['node_modules'], // 忽略文件目录,当然我们在inlcude中制定了文件路径,这个忽略目录可以不加
//       include: path.join(__dirname, '../dist/'), // 上传dist文件的js
//       configFile: './.sentryclirc', // 配置文件地址
//       release: 'test_vhall_02', // 版本号 ------------这个写死  不然传不到sentry上  source-map就不起作用了
//     })
//   )
// }
const webpackConfig = merge(baseConfig, {
  mode: 'production',
  output: {
    filename: subPath('js/[name].[chunkhash:8].js'),
    path: resolve('dist')
  },
  module: {
    rules: [
      {
        test: /\.scss/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ],
        include: resolve('src')
      },
      {
        test: /\.css/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: process.env.BUILD_ENV != 'prod', // set to true if you want JS source maps,
        terserOptions: {
          warnings: false,
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  performance: {
    hints: false
  },
  plugins: plugins
})

module.exports = webpackConfig
