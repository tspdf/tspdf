import js from '@eslint/js';
import onlyWarn from 'eslint-plugin-only-warn';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import turboPlugin from 'eslint-plugin-turbo';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import("eslint").Linter.Config[]} */
export const config = [
  // Global ignores - these apply to all packages using this config
  {
    ignores: [
      // Dependencies and build outputs
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',

      // Framework specific
      '**/.next/**',
      '**/.docusaurus/**',

      // Tooling
      '**/.turbo/**',
      '**/coverage/**',
      '**/.nyc_output/**',

      // IDE and OS
      '**/.vscode/**',
      '**/.idea/**',
      '**/Thumbs.db',
      '**/.DS_Store',
    ],
  },

  // Core JS rules for all files
  js.configs.recommended,

  // TypeScript ESLint configuration for .ts/.tsx files only
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      ...tseslint.configs.strict.rules,
      ...tseslint.configs.stylistic.rules,
      // Allow unused variables with underscore prefix
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          // Don't flag enum members as unused - they're often used in other files
          ignoreRestSiblings: true,
        },
      ],
      // Don't flag regular unused vars for enum members - let TS ESLint handle it
      'no-unused-vars': 'off',
    },
  },

  // Basic TypeScript rules for JavaScript files (no type checking)
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      ...tseslint.configs.base.rules,
      // Allow unused variables with underscore prefix
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Prettier integration
  eslintPluginPrettierRecommended,

  // Override Prettier rules to be warnings instead of errors
  {
    rules: {
      'prettier/prettier': 'warn',
    },
  },

  // Turbo monorepo plugin
  {
    plugins: { turbo: turboPlugin },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },

  // Import sorting
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
    },
  },

  // Convert all errors to warnings
  { plugins: { onlyWarn } },
];

export default config;
