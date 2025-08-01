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
        dir: outDir,
        format: 'es',
        sourcemap: false,
        entryFileNames: filename,
        chunkFileNames: '[name].js',
      },
      plugins: [...basePlugins],
      external: id => {
        // Bundle @tspdf packages, externalize everything else that's not relative
        if (id.startsWith('@tspdf/')) return false;
        if (id === 'pdfjs-dist') return false; // Bundle pdfjs-dist
        return !id.startsWith('.') && !id.startsWith('/');
      },
      treeshake: {
        moduleSideEffects: id => {
          // Preserve side effects for CSS files and stylesheets
          return /\.(css|scss|sass|less|styl)$/.test(id);
        },
      },
    },

    // TypeScript declarations
    createTypeScriptDeclarationsConfig(resolvedInput, outDir),
  ];
}
