let path = require('path')

let output_library  = "SmoothieHappy"
let output_filename = "smoothie-happy.js"

let src_path  = path.resolve('./src')
let dist_path = path.resolve('./dist')

module.exports = {
  context: src_path,
  entry: [
    "./index.js"
  ],
  output: {
    path: dist_path,
    filename: output_filename,
    library: output_library,
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"]
      }
    ]
  },
  devServer: {
    contentBase: dist_path
  },
  devtool: "source-map"
};
