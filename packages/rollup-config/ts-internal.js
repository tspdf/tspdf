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
    filename = 'index.js',
    plugins = [],
  } = options;

  // Get base configuration
  const baseConfig = createBaseConfig({
    input,
    packageJsonPath,
    outputDir,
    minify,
    target,
    plugins,
  });

  const { resolvedInput, basePlugins, outputDir: outDir } = baseConfig;

  return [
    // ESM only
    {
      input: resolvedInput,
      output: {
        file: `${outDir}/${filename}`,
        format: 'es',
        sourcemap: true,
      },
      plugins: [...basePlugins],
      external: ['pdfjs-dist'],
      treeshake: { moduleSideEffects: false },
    },

    // TypeScript declarations
    createTypeScriptDeclarationsConfig(resolvedInput, outDir),
  ];
}
