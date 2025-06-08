import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

import { config as baseConfig } from './base.js';

// Sanitize globals: trim whitespace from names
const mergedGlobals = { ...globals.serviceworker, ...globals.browser };
const sanitizedGlobals = Object.fromEntries(
  Object.entries(mergedGlobals).map(([key, val]) => [key.trim(), val]),
);

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  ...baseConfig,

  // React configuration
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: sanitizedGlobals,
    },
  },

  // React Hooks
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    settings: {
      react: { version: '19.1.0' },
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform
      'react/react-in-jsx-scope': 'off',
    },
  },

  // Ensure React-specific rules are warnings, not errors
  {
    rules: {
      'react/prop-types': 'warn',
      'react/display-name': 'warn',
      'react/no-unescaped-entities': 'warn',
    },
  },
];

export default config;
