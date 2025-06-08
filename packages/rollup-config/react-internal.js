import postcssTailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

import {
  createBaseConfig,
  createBrowserOutputConfig,
  createNodeOutputConfig,
  createTypeScriptDeclarationsConfig,
  createUmdOutputConfig,
  createWorkspaceAlias,
} from './base.js';

/**
 * Creates a Rollup configuration for React component libraries
 * @param {Object} options - Configuration options
 * @param {string} options.input - Entry point file path
 * @param {string} options.packageJsonPath - Path to package.json file
 * @param {string} [options.outputDir] - Output directory (defaults to 'dist')
 * @param {boolean} [options.minify] - Whether to minify output (defaults to true)
 * @param {string} [options.target] - esbuild target (defaults to 'es2022')
 * @param {Object} [options.globals] - UMD globals mapping
 * @param {string} [options.umdName] - UMD global variable name
 * @param {boolean} [options.preserveModules] - Whether to preserve modules for better tree-shaking
 * @param {boolean} [options.includeBrowser] - Whether to include browser-optimized builds
 * @param {Array} [options.bundledDependencies] - Dependencies to bundle instead of externalize (defaults to [])
 * @returns {Array} Rollup configuration array
 */
export function createReactLibraryConfig(options) {
  const {
    input,
    packageJsonPath,
    outputDir = 'dist',
    minify = true,
    target = 'es2022',
    globals = {
      react: 'React',
      'react-dom': 'ReactDOM',
      'react/jsx-runtime': 'jsxRuntime',
      'react/jsx-dev-runtime': 'jsxDevRuntime',
    },
    umdName = 'MyLibrary', // Default UMD name - should be overridden by packages
    preserveModules = false,
    includeBrowser = true,
    bundledDependencies = [], // Dependencies to bundle instead of externalize
  } = options;

  // Get base configuration optimized for React/browser
  const baseConfig = createBaseConfig({
    input,
    packageJsonPath,
    outputDir,
    minify,
    target,
    browser: true, // Optimize for browser environment
    preserveModules,
    dedupe: ['react', 'react-dom'], // Dedupe React packages that should be singletons
    plugins: [
      createWorkspaceAlias(bundledDependencies), // Resolve workspace deps to source
      peerDepsExternal(), // Automatically externalize peer dependencies
      postcss({
        plugins: [postcssTailwind(), autoprefixer()],
        minimize: minify,
        inject: true,
        sourceMap: true,
        // Extract CSS to separate file for better caching
        extract: 'styles.css',
      }),
    ],
  });

  const { resolvedInput, basePlugins, outputDir: outDir } = baseConfig;

  const getExternal = bundledDeps => id => {
    // Never externalize bundled dependencies
    if (bundledDeps.some(dep => id === dep || id.startsWith(`${dep}/`))) {
      return false;
    }
    // Let peerDepsExternal plugin handle the rest automatically
    return false; // Plugin will handle peer deps
  };

  const configs = [
    // 1) Main bundle (ESM + CJS for Node.js/bundlers)
    {
      input: resolvedInput,
      output: createNodeOutputConfig(outDir, { preserveModules }),
      plugins: [...basePlugins],
      external: getExternal(bundledDependencies),
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
    },

    // 2) UMD bundle for direct browser usage
    {
      input: resolvedInput,
      output: createUmdOutputConfig(outDir, umdName, globals),
      plugins: basePlugins.filter(
        plugin => !plugin.name || plugin.name !== 'copy',
      ), // Remove copy plugin to avoid conflicts
      external: getExternal(bundledDependencies),
    },

    // 3) TypeScript declarations
    createTypeScriptDeclarationsConfig(resolvedInput, outDir, {
      respectExternal: true,
      bundledDependencies, // Include bundled dependencies in declarations
    }),
  ];

  // 4) Optional browser-optimized builds
  if (includeBrowser) {
    configs.push({
      input: resolvedInput,
      output: createBrowserOutputConfig(outDir, umdName, globals),
      plugins: basePlugins.filter(
        plugin => !plugin.name || plugin.name !== 'copy',
      ), // Remove copy plugin to avoid conflicts
      external: getExternal(bundledDependencies),
    });
  }

  return configs;
}
