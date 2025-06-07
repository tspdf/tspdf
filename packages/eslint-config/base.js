import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import turboPlugin from "eslint-plugin-turbo";
import onlyWarn from "eslint-plugin-only-warn";

/** @type {import("eslint").Linter.Config[]} */
export const config = [
  // 1) ignore build outputs & config scripts
  {
    ignores: ["dist/**", "**/*.mjs", "**/*.config.mjs"],
  },

  // Core JS rules
  js.configs.recommended,

  // —— Spread the TypeScript-ESLint helper’s array into ours ——
  ...tseslint.config(
    js.configs.recommended,
    tseslint.configs.strictTypeChecked,
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
    },
    tseslint.configs.stylisticTypeChecked,
    eslintPluginPrettierRecommended
  ),

  // turbo plugin
  {
    plugins: { turbo: turboPlugin },
    rules: { "turbo/no-undeclared-env-vars": "warn" },
  },

  // simple-import-sort
  {
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },

  // downgrade everything to warnings
  { plugins: { onlyWarn } },
];

export default config;
