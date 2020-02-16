const path = require('path');

module.exports = {
  mode: "production",
  entry: "./dist/main.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
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
