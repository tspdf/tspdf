import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

/** @type {import("eslint").Linter.Config[]} */
export const configFilesConfig = [
  // Config for all config files (JS, MJS, TS)
  {
    files: [
      '**/*.config.{js,mjs,cjs,ts}',
      '**/eslint.config.mjs',
      '**/prettier.config.mjs',
      '**/rollup.config.mjs',
      '**/tsup.config.ts',
      '**/docusaurus.config.ts',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    ...js.configs.recommended,
    ...eslintPluginPrettierRecommended,
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      // Allow console.log in config files
      'no-console': 'off',
      // Allow unused variables in config files (they might be interface implementations)
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];

export default configFilesConfig;
