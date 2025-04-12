const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'picture-edit.js',
    library: {
      name: 'PED',
      type: 'umd',
    },
  },
  mode: "production",
  devServer: {
    static: './dist',
    hot: true,
    client: {
      overlay: {
        warnings: false, // 不在页面上显示警告
        errors: true, // 显示错误
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',//指定一个HTML模板文件
      filename: 'index.html'//生成的HTML文件名，默认是index.html
    })
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader'], // 使用 html-loader 加载 HTML 文件
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          "less-loader"
        ]
      },
      {
        test: /\.svg$/,
        type: 'asset/resource',
      }
    ]
  },
};