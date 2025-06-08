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
      // Rollup config files
      '**/packages/rollup-config/**/*.js',
      // Other config directories that don't follow .config naming
      '**/packages/tailwind-config/**/*.js',
      '**/packages/eslint-config/**/*.js',
      '**/packages/typescript-config/**/*.json',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        console: 'readonly',
        process: 'readonly',
      },
    },
    ...js.configs.recommended,
    ...eslintPluginPrettierRecommended,
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      // Allow console.log in config files
      'no-console': 'off',
      // Allow unused variables in config files
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      // Don't require strict mode in config files
      strict: 'off',
      // Allow require() in config files
      'global-require': 'off',
      // Disable undef as we have proper globals
      'no-undef': 'off',
    },
  },
];

export default configFilesConfig;
