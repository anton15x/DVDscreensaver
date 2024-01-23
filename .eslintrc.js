/* eslint-env node */

// eslint config file: https://eslint.org/docs/latest/use/configure/configuration-files
// typescript-eslint extends: https://typescript-eslint.io/linting/configs/

/**
 * tsConfigForFile
 *
 * @param {string} filename the tsconfig filepath
 */
function tsConfigForFile(filename) {
  return {
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended-type-checked',
      'plugin:@typescript-eslint/stylistic-type-checked',
      'plugin:@typescript-eslint/strict-type-checked',
    ],
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
    ],
    parserOptions: {
      project: filename,
      tsconfigRootDir: __dirname,
    },
  };
}

/**
 * 
 * @param {Record<string,any>} obj1 
 * @param {Record<string,any>} obj2 
 * @returns 
 */
function mergeObjects(obj1, obj2) {
  var ret = {};
  var key;
  for (key in obj1) {
    ret[key] = obj1[key];
  }
  for (key in obj2) {
    ret[key] = obj2[key];
  }
  return ret;
}

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic',
    'plugin:@typescript-eslint/strict',
  ],
  "ignorePatterns": [
    "dist",
    "docs",
  ],
  root: true,
  /*
  overrides: [
    {
      files: ['*.js'],
      extends: [
        'plugin:@typescript-eslint/disable-type-checked',
      ],
    },
  ],
  */
  overrides: [
    mergeObjects({
      files: ['src/**/*.ts'],
    }, tsConfigForFile('tsconfig.json')),
    mergeObjects({
      files: ['test/**/*.ts'],
    }, tsConfigForFile('tsconfig.test.json')),
  ],
};
