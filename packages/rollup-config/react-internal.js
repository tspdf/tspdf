import postcssTailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

import { createTypeScriptLibraryConfig } from './ts-internal.js';

/**
 * Create React library configuration
 * Extends TypeScript config with React-specific plugins
 */
export function createReactLibraryConfig(options) {
  const {
    tailwindContent = ['./src/**/*.{js,ts,jsx,tsx}'],
    plugins = [],
    external = [],
    ...baseOptions
  } = options;

  const config = createTypeScriptLibraryConfig({
    ...baseOptions,
    filename: 'index.esm.js',
    plugins: [
      peerDepsExternal(),
      postcss({
        plugins: [
          postcssTailwind({
            content: tailwindContent,
          }),
          autoprefixer(),
        ],
        minimize: baseOptions.minify ?? true,
        inject: false,
        extract: 'index.css',
        sourceMap: true,
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
      'pdfjs-dist',
      ...external,
    ];
  }

  return config;
}
