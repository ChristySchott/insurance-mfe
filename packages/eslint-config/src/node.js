import globals from "globals";
import baseConfig from "./base.js";

export default [
  ...baseConfig,
  {
    files: ["**/*.{ts,js}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node,
    },
  },
];
