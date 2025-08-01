import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

import { createTypeScriptLibraryConfig } from './ts-internal.js';

/**
 * Create React library configuration
 * Extends TypeScript config with React-specific plugins
 */
export function createReactLibraryConfig(options) {
  const { plugins = [], external = [], ...baseOptions } = options;

  const config = createTypeScriptLibraryConfig({
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
    config[0].external = [
      'react',
      'react-dom',
      'react/jsx-runtime',
      // Don't externalize @tspdf packages or pdfjs-dist - bundle them
      ...external.filter(ext => !ext.startsWith('@tspdf/')),
    ];
  }

  return config;
}
