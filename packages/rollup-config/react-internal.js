import postcssTailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

import {
  createBaseConfig,
  createNodeOutputConfig,
  createTypeScriptDeclarationsConfig,
  createUmdOutputConfig,
  createWorkspaceAlias,
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
    bundledDependencies = [],
  } = options;

  // Get base configuration
  const baseConfig = createBaseConfig({
    input,
    packageJsonPath,
    outputDir,
    minify,
    target,
    plugins: [
      createWorkspaceAlias(bundledDependencies),
      peerDepsExternal(),
      postcss({
        plugins: [postcssTailwind(), autoprefixer()],
        minimize: minify,
        inject: true,
        sourceMap: true,
        extract: 'styles.css',
      }),
    ],
  });

  const { resolvedInput, basePlugins, outputDir: outDir } = baseConfig;

  // External function that bundles workspace dependencies
  const getExternal = bundledDeps => id => {
    // Bundle workspace dependencies
    if (bundledDeps.some(dep => id === dep || id.startsWith(`${dep}/`))) {
      return false;
    }
    // Let peerDepsExternal plugin handle the rest (peer deps will be external)
    return null;
  };

  return [
    // ESM + CJS for Node.js/bundlers
    {
      input: resolvedInput,
      output: createNodeOutputConfig(outDir),
      plugins: [...basePlugins],
      external: getExternal(bundledDependencies),
      treeshake: { moduleSideEffects: false },
    },

    // UMD for browser
    {
      input: resolvedInput,
      output: createUmdOutputConfig(outDir, umdName, globals),
      plugins: basePlugins.filter(p => p.name !== 'copy'),
      external: getExternal(bundledDependencies),
    },

    // TypeScript declarations
    createTypeScriptDeclarationsConfig(resolvedInput, outDir),
  ];
}
