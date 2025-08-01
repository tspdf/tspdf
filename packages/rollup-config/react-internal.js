import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

import { createTypeScriptLibraryConfig } from './ts-internal.js';

/**
 * Create React library configuration
 * Extends TypeScript config with React-specific plugins
 */
export async function createReactLibraryConfig(options) {
  const { plugins = [], ...baseOptions } = options;

  const config = await createTypeScriptLibraryConfig({
    ...baseOptions,
    filename: 'index.esm.js',
    plugins: [
      peerDepsExternal(),
      postcss({
        plugins: [tailwindcss(), autoprefixer()],
        minimize: baseOptions.minify ?? true,
        inject: {
          insertAt: 'top',
        },
        sourceMap: false,
        extract: false,
      }),
      ...plugins,
    ],
  });

  // Add React externals to the main build config
  if (config[0]) {
    const originalExternal = config[0].external;
    config[0].external = id => {
      // Check React externals first
      if (['react', 'react-dom', 'react/jsx-runtime'].includes(id)) {
        return true;
      }
      // Use the original external logic from ts-internal
      if (typeof originalExternal === 'function') {
        return originalExternal(id);
      }
      return false;
    };
  }

  return config;
}
