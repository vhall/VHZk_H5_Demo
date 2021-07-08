const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
var CompressionPlugin = require("compression-webpack-plugin")
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')
const config = require('./config')

const isProd = process.env.NODE_ENV === 'production'

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

function subPath (_path) {
  return path.posix.join(config[process.env.BUILD_ENV].SUB_DIR, _path)
}

const webpackConfig = {
  target: 'web',
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? '' : 'source-map',
  entry: {
    index: resolve('src/app.js')
  },
  output: {
    filename: subPath('js/[name].[hash:8].js'),
    path: resolve('dist'),
    publicPath: config[process.env.BUILD_ENV].PUBLIC_PATH
  },
  externals: {
    'vue': 'Vue',
    'vuex':'Vuex',
    'vue-router': 'VueRouter',
    'axios' : 'axios'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      src: resolve('src'),
      assets: resolve('src/assets'),
      components: resolve('src/components'),
      store: resolve('src/store')
    }
  },
  module: {
    rules: [
      {
        test: /\.(vue|js|jsx)$/,
        loader: 'eslint-loader',
        include: resolve('src'),
        exclude: [resolve('node_modules'), resolve('src/static')],
        enforce: 'pre'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: resolve('src')
      },
      {
        test: /\.js[x]?$/,
        loader: 'babel-loader',
        include: resolve('src')
      },
      {
        test: /.(png|jpg|gif|webp)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: subPath('img/[name].[ext]'),
              limit: 5000 // 单位是byte
            }
          }
        ],
        include: resolve('src')
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5000,
              name: subPath('media/[name].[ext]')
            }
          }
        ],
        include: resolve('src')
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 50,
              name: subPath('fonts/[name].[ext]')
            }
          }
        ],
        include: resolve('src')
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        common: {
          name: 'common',
          chunks: 'async',
          minChunks: 2,
          minSize: 0
        },
        vender: {
          name: 'vendor',
          test: resolve('node_modules'),
          chunks: 'all',
          priority: 10
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  },
  plugins: [
    new FilterWarningsPlugin({
      exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.svg$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      minify: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        MOCK: JSON.stringify(config[process.env.BUILD_ENV].MOCK),
        IMGHOST: JSON.stringify(config[process.env.BUILD_ENV].IMGHOST),
        BUILD_ENV: JSON.stringify(config[process.env.BUILD_ENV].BUILD_ENV),
        NODE_ENV: JSON.stringify(config[process.env.BUILD_ENV].NODE_ENV),
        API_PATH: JSON.stringify(config[process.env.BUILD_ENV].API_PATH),
        PUBLIC_PATH: JSON.stringify(config[process.env.BUILD_ENV].PUBLIC_PATH),
        SUB_DIR: JSON.stringify(config[process.env.BUILD_ENV].SUB_DIR),
        MOBILE_HOST: JSON.stringify(config[process.env.BUILD_ENV].MOBILE_HOST),
        SAASROUTE: JSON.stringify(config[process.env.BUILD_ENV].SAASROUTE)
      }
    }),
    new CopyWebpackPlugin([
      {
        from: resolve('src/static'),
        to: resolve(`dist/${config[process.env.BUILD_ENV].SUB_DIR}`),
        ignore: ['.*']
      }
    ])
  ]
}

module.exports = webpackConfig
