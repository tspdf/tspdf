import postcssTailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

import {
  createBaseConfig,
  createNodeOutputConfig,
  createTypeScriptDeclarationsConfig,
  createUmdOutputConfig,
} from './base.js';

/**
 * Create React library configuration
 */
export function createReactLibraryConfig(options) {
  const {
    input,
    packageJsonPath,
    outputDir = 'dist',
    minify = true,
    target = 'es2024',
    globals = {
      react: 'React',
      'react-dom': 'ReactDOM',
      'react/jsx-runtime': 'jsxRuntime',
    },
    umdName = 'MyLibrary',
    plugins = [],
  } = options;

  // Get base configuration
  const baseConfig = createBaseConfig({
    input,
    packageJsonPath,
    outputDir,
    minify,
    target,
    plugins: [
      peerDepsExternal(),
      postcss({
        plugins: [postcssTailwind(), autoprefixer()],
        minimize: minify,
        inject: true,
        sourceMap: true,
        extract: 'styles.css',
      }),
      ...plugins,
    ],
  });

  const { resolvedInput, basePlugins, outputDir: outDir } = baseConfig;

  return [
    // ESM + CJS for Node.js/bundlers
    {
      input: resolvedInput,
      output: createNodeOutputConfig(outDir),
      plugins: [...basePlugins],
      treeshake: { moduleSideEffects: false },
    },

    // UMD for browser
    {
      input: resolvedInput,
      output: createUmdOutputConfig(outDir, umdName, globals),
      plugins: basePlugins.filter(p => p.name !== 'copy'),
    },

    // TypeScript declarations
    createTypeScriptDeclarationsConfig(resolvedInput, outDir),
  ];
}
