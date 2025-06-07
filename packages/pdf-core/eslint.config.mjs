import config from "@tspdf/eslint-config/base";

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    // Override for TypeScript config files in this package
    files: ["*.config.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
];
