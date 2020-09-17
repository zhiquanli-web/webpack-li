const path = require("path");

const config = require('../config')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')

const SimpleProgressWebpackPlugin = require( 'simple-progress-webpack-plugin' )

const { merge } = require('webpack-merge')
const common = require('./webpack.base.conf')

const commomCssLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          'postcss-preset-env',
        ],
      },
    },
  },
] 


const webpackConfig = merge(common, {
  mode: "production",
  output: {
    path: config.build.assetsRoot,
    filename: 'static/js/name.[chunkhash:7].js',
    chunkFilename: 'static/js/[id].[chunkhash:7].js'
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [...commomCssLoader]
      },
      {
        test: /\.scss$/,
        use: [...commomCssLoader, "sass-loader",],
      },
      {
        test: /\.sass$/,
        use: [...commomCssLoader, "sass-loader",],
      },
      // {
      //   // 第三种方式：按需加载
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: "babel-loader?cacheDirectory=true",
      //   /* options: {
      //     // 预设：指示babel做怎样的兼容性处理
      //     presets: [
      //       [
      //         "@babel/preset-env", // 基本预设
      //         {
      //           useBuiltIns: "usage", //按需加载
      //           corejs: { version: 3 }, // 指定core-js版本
      //           targets: {
      //             // 指定兼容到什么版本的浏览器
      //             chrome: "60",
      //             firefox: "50",
      //             ie: "8",
      //             safari: "10",
      //             edge: "17",
      //           }
      //         },
      //       ],
      //     ],
      //     // 开启babel缓存, 第二次构建时，会读取之前的缓存
      //     cacheDirectory: true
      //   }, */
      // },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "async",
      cacheGroups: {
        vendor: {
          // 将第三方模块提取出来
          minSize: 30000,
          minChunks: 1,
          test: /node_modules/,
          chunks: "initial",
          name: "vendor",
          priority: 1,
        },
        commons: {
          test: /[\\/]src[\\/]common[\\/]/,
          name: "commons",
          minSize: 30000,
          minChunks: 3,
          chunks: "initial",
          priority: -1,
          reuseExistingChunk: true, // 这个配置允许我们使用已经存在的代码块
        },
      },
    },
    runtimeChunk: { name: "runtime" },
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        // 是否开启多线程
        parallel: true,
        // 是否开启映射
        sourceMap: true,
        terserOptions: {
          warnings: false,
          // 去除打印
          compress: {
            warnings: false,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ["console.log"],
          },
          // 去除注释，当设置为true时，会保留注释
          output: {
            comments: false,
          },
        },
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessorOptions: {
          safe: true,
          autoprefixer: { disable: true },
          mergeLonghand: false,
          discardComments: {
            removeAll: true, // 移除注释
          },
        },
        canPrint: true,
      }),
    ],
    mergeDuplicateChunks: true
  },
  // 超过250k给出警告
  performance: {
    hints: 'warning'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: './public/index.html',
      inject: true,
      // favicon: resolve('favicon.ico'),
      title: 'webpack-demo',
      path: config.build.assetsPublicPath + config.build.assetsSubDirectory,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more webpackConfig:
        // https://github.com/kangax/html-minifier#webpackConfig-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // chunksSortMode: 'dependency'
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[hash:10].css",
      chunkFilename: "static/css/[name].[contenthash:8].css",
    }),
    // 显示打包进度百分比
    new SimpleProgressWebpackPlugin(),
  ],
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      "@": path.resolve("src"),
    },
  },
  // 控制台输出信息
  stats: {
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }
});

// 开启gzip压缩
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      algorithm: 'gzip',// 压缩算法
      threshold: 10 * 1024,// 处理大于8kb的资源
      deleteOriginalAssets: false, // 是否删除原文件
      cache: true,// 开启缓存
      test: new RegExp(
        '\\.(' +
        ['js', 'css'].join('|') +
        ')$'
      ),
      minRatio: 0.8,
      filename: 'static/js/[name].gz[query]',
    })
  )
}
// 启用打包分析
if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}


// 打包进度条插件 simple-progress-webpack-plugin
module.exports = webpackConfig;
