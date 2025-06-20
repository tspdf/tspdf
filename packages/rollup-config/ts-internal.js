import {
  createBaseConfig,
  createTypeScriptDeclarationsConfig,
} from './base.js';

/**
 * Create TypeScript library configuration for internal packages
 * ESM-only format optimized for tree-shaking
 */
export function createTypeScriptLibraryConfig(options) {
  const {
    input,
    packageJsonPath,
    outputDir = 'dist',
    minify = true,
    target = 'es2024',
  } = options;

  // Get base configuration
  const baseConfig = createBaseConfig({
    input,
    packageJsonPath,
    outputDir,
    minify,
    target,
  });

  const {
    resolvedInput,
    basePlugins,
    outputDir: outDir,
    defaultExternal,
  } = baseConfig;

  return [
    // ESM only for optimal tree-shaking
    {
      input: resolvedInput,
      output: {
        file: `${outDir}/index.js`,
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
      plugins: [...basePlugins],
      external: defaultExternal,
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
      },
    },

    // TypeScript declarations
    createTypeScriptDeclarationsConfig(resolvedInput, outDir),
  ];
}
