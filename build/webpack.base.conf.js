const path = require('path')

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const config = require('../config')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  // context 是webpack entry的上下文，是入口文件所处的目录的绝对路径，默认为根目录
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: 'static/js/[name].[hash:8].js',
    // publicPath 并不会对生成文件的路径造成影响，主要是对你的页面里面引入的资源的路径做对应的补全，常见的就是css文件里面引入的图片
    publicPath: config.build.assetsPublicPath,// 这里需要用process.env作区分dev/prod模式
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'url-loader',
        exclude: [resolve('src/icons')],
        options: {
          limit: 8 * 1024,
          name: "imgs/[name].[hash:7].[ext]",
          esModule: false,
          outputPath: "static/imgs",
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          name: 'static/fonts/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
  // externals: {
  //   'vue': 'Vue',
  //   'vue-router': 'VueRouter',
  //   'element-ui': 'ElementUI'  
  // },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      "@": resolve('src')
    }
  },
  devtool: "eval-source-map",
}