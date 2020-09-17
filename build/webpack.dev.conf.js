const path = require("path");

// const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.base.conf')
const config = require('../config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const portfinder = require('portfinder')
const webpack = require('webpack')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const devWebpackConfig = merge(common, {
  mode: "development",
  devServer: {
    contentBase: path.resolve(__dirname, "../dist"),
    host: config.dev.host,
    port: config.dev.port,
    open: config.dev.autoOpenBrowser,
    hot: true,
    // 当编译器出现错误时，在全屏覆盖显示错误位置
    overlay: config.dev.errorOverlay ? { warning: false, errors: true } : false,
    // 启用简洁报错
    // quiet: true,
    // 启用gzip压缩
    compress: true,
    publicPath: config.dev.assetsPublicPath,
    // 代理
    proxy: config.dev.proxyTable,
    // errors-warnings：只在发生错误或重新编译时输出（与）
    // stats: 'errors-warnings'
    quiet: true,
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // 这里不能使用vue-style-loader，否则element的样式会失效，具体原因未知
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        // 这里不能使用vue-style-loader，.vue文件样式(!css)不生效
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.sass$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: "./public/index.html",
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        // inject为true or body 时，所有JavaScript资源都将放在body的底部
        inject: true,
        // 网页小图标
        // favicon: resolve('favicon.ico'),
        // 用于生成的HTML文档的标题
        title: 'webpack-demo',
        path: config.dev.assetsPublicPath + config.dev.assetsSubDirectory
      },
    }),
  ]
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})