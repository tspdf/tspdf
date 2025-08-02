import { createTypeScriptLibraryConfig } from '@tspdf/rollup-config/ts-internal';
import { dirname, resolve } from 'path';
import copy from 'rollup-plugin-copy';
import dts from 'rollup-plugin-dts';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const licenseFile = resolve(__dirname, '../../licenses/pdfjs-dist.txt');

const pdfCoreConfig = await createTypeScriptLibraryConfig({
  input: 'src/index.ts',
  packageJsonPath: './package.json',
  minify: true,
  filename: 'index.esm.js',
  plugins: [
    copy({
      targets: [
        {
          src: licenseFile,
          dest: 'dist/pdfjs-dist',
          rename: 'LICENSE-pdfjs-dist.txt',
        },
      ],
      hook: 'writeBundle',
    }),
  ],
});

// Shared external function for both JS and TypeScript configs
const createExternalFunction =
  (includeTypesCheck = false) =>
  id => {
    // Don't externalize @tspdf/pdf-core since this is the pdf-core package
    if (id.includes('@tspdf/pdf-core')) {
      return false;
    }

    // Don't externalize pdfjs-dist - bundle it in pdf-core
    if (
      id === 'pdfjs-dist' ||
      (includeTypesCheck && id.startsWith('pdfjs-dist/'))
    ) {
      return false;
    }

    // Keep CSS files external (only relevant for TypeScript config)
    if (includeTypesCheck && /\.css$/.test(id)) {
      return true;
    }

    // External everything else from node_modules except pdfjs-dist
    if (/node_modules/.test(id) && !id.includes('pdfjs-dist')) {
      return true;
    }

    return false;
  };

// Configure JavaScript build
if (pdfCoreConfig[0] && pdfCoreConfig[0].output) {
  pdfCoreConfig[0].output.manualChunks = {
    'pdfjs-dist/index.esm': ['pdfjs-dist'],
  };
  pdfCoreConfig[0].output.chunkFileNames = '[name].js';
  delete pdfCoreConfig[0].output.paths;
  pdfCoreConfig[0].external = createExternalFunction();
}

// Configure TypeScript declarations
if (pdfCoreConfig[1]) {
  pdfCoreConfig[1].external = createExternalFunction(true);

  const dtsPluginIndex = pdfCoreConfig[1].plugins.findIndex(
    plugin => plugin.name === 'dts',
  );
  if (dtsPluginIndex !== -1) {
    pdfCoreConfig[1].plugins[dtsPluginIndex] = dts({
      respectExternal: true,
    });
  }
}

export default pdfCoreConfig;
