import globals from "globals";
import stylisticJs from '@stylistic/eslint-plugin-js';
import js from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"},
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      'eqeqeq': 'error',
      'no-console': "off",
      '@stylistic/js/indent': ["error", 2],
      '@stylistic/js/linebreak-style': ["error", "unix"],
      '@stylistic/js/quotes': ["error", "single"],
      '@stylistic/js/semi': ["error", "always", { "omitLastInOneLineClassBody": true}],
      '@stylistic/js/arrow-spacing': "error",
      '@stylistic/js/object-curly-spacing': ["error", "always"],
      '@stylistic/js/no-trailing-spaces': "error",
    },
  },// ignore a dir globally
  {ignores: ["dist/"]},
  js.configs.recommended, {rules: { "no-unused-vars": "warn" }},
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
];