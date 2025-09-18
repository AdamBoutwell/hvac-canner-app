module.exports = [
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    rules: {
      "quotes": ["error", "double"],
      "indent": ["error", 2],
      "semi": ["error", "always"],
      "no-unused-vars": "warn",
      "no-console": "warn",
    },
  },
  {
    ignores: ["lib/**/*", "generated/**/*", "node_modules/**/*"],
  },
];
