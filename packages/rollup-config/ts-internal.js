import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import {
  createBaseConfig,
  createTypeScriptDeclarationsConfig,
} from './base.js';

/**
 * Create TypeScript library configuration for internal packages
 * ESM-only format optimized for tree-shaking
 */
export async function createTypeScriptLibraryConfig(options) {
  const {
    input,
    packageJsonPath,
    outputDir = 'dist',
    minify = true,
    target = 'es2024',
    filename = 'index.js',
    plugins = [],
    additionalExternals = [],
    copyPdfCore = false,
  } = options;

  // Handle pdf-core copying if requested
  let allPlugins = [...plugins];
  if (copyPdfCore) {
    // Dynamic import of copy plugin to avoid loading if not needed
    const copy = await import('rollup-plugin-copy').then(m => m.default);
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const pdfCoreDistPath = resolve(__dirname, '../pdf-core/dist');

    allPlugins.push(
      copy({
        targets: [
          {
            src: `${pdfCoreDistPath}/*`,
            dest: 'dist/pdf-core',
          },
        ],
        hook: 'writeBundle',
      }),
    );
  }

  // Get base configuration
  const baseConfig = createBaseConfig({
    input,
    packageJsonPath,
    outputDir,
    minify,
    target,
    plugins: allPlugins,
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
        chunkFileNames: chunkInfo => {
          // Place @tspdf/pdf-core chunks in pdf-core folder
          if (
            chunkInfo.facadeModuleId?.includes('@tspdf/pdf-core') ||
            chunkInfo.moduleIds.some(id => id.includes('@tspdf/pdf-core'))
          ) {
            return 'pdf-core/[name].js';
          }
          return '[name].js';
        },
        manualChunks: id => {
          // Create a separate chunk for @tspdf/pdf-core
          if (id.includes('@tspdf/pdf-core')) {
            return 'pdf-core';
          }
        },
        paths: {
          '@tspdf/pdf-core': './pdf-core/index.esm.js',
        },
      },
      plugins: [...basePlugins],
      external: id => {
        // Always externalize @tspdf/pdf-core
        if (id.includes('@tspdf/pdf-core')) {
          return true;
        }
        // Check additional externals
        if (additionalExternals.includes(id)) {
          return true;
        }
        // Bundle other @tspdf packages
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
