const path = require('path');

module.exports = {
  mode: "development",
  entry: "./dist/main.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.dev.js",
    library: "DvdScreensaver",
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'url-loader'
      },
    ]
  }
}
