
/**
 * To handle svg imports:
 *
 * 1. typescript: declare module *.svg
 * 2. webpack: 'npm install url-loader' + add to config:
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'url-loader'
      },
    ]
  }
 * 3. jest: 'npm install --save-dev identity-obj-proxy' + add to config:
  moduleNameMapper: {
    '.+\\.(svg|png|jpg)$': 'identity-obj-proxy'
  }
 */
declare module "*.svg" {
  const content: string;
  export default content;
}
