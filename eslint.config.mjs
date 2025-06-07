import { config } from '@tspdf/eslint-config/base';
import { configFilesConfig } from '@tspdf/eslint-config/config-files';

/** @type {import("eslint").Linter.Config[]} */
export default [
  // Specific config for JavaScript config files (no type checking) - MUST come before TypeScript config
  ...configFilesConfig,

  // Main config for TypeScript files
  ...config,
];
