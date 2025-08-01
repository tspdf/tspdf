import { createTypeScriptLibraryConfig } from '@tspdf/rollup-config/ts-internal';
import { dirname, resolve } from 'path';
import copy from 'rollup-plugin-copy';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const licenseFile = resolve(__dirname, '../../licenses/pdfjs-dist.txt');

const pdfCoreConfig = await createTypeScriptLibraryConfig({
  input: 'src/index.ts',
  packageJsonPath: './package.json',
  minify: false,
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

// Add manual chunks for pdfjs-dist
if (pdfCoreConfig[0] && pdfCoreConfig[0].output) {
  pdfCoreConfig[0].output.manualChunks = {
    'pdfjs-dist/index.esm': ['pdfjs-dist'],
  };

  // Override chunk file naming to use .js extension consistently
  pdfCoreConfig[0].output.chunkFileNames = '[name].js';

  // Remove paths mapping since this IS the pdf-core package
  delete pdfCoreConfig[0].output.paths;

  // Override external to not externalize @tspdf/pdf-core since this IS pdf-core
  const originalExternal = pdfCoreConfig[0].external;
  pdfCoreConfig[0].external = id => {
    // Don't externalize @tspdf/pdf-core since this is the pdf-core package
    if (id.includes('@tspdf/pdf-core')) {
      return false;
    }
    return originalExternal(id);
  };
}

export default pdfCoreConfig;
