module.exports = {
    env: {
      browser: true,
      es6: true,
      node: true
    },
    extends: ["airbnb-base", "prettier"],
    globals: {
      Atomics: "readonly",
      SharedArrayBuffer: "readonly"
    },
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: "module"
    },
    rules: {
      "no-console": "off",
      "no-else-return": "off",
      "camelcase": "off",
      "no-underscore-dangle": "off"
      //"no-use-before-define": "off"
    }
  };