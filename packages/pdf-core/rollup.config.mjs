import { createTypeScriptLibraryConfig } from '@tspdf/rollup-config/ts-internal';

const pdfCoreConfig = createTypeScriptLibraryConfig({
  input: 'src/index.ts',
  packageJsonPath: './package.json',
  minify: true,
  filename: 'index.esm.js',
});

// Add manual chunks for pdfjs-dist
if (pdfCoreConfig[0] && pdfCoreConfig[0].output) {
  pdfCoreConfig[0].output.manualChunks = {
    pdfjs: ['pdfjs-dist'],
  };
}

export default pdfCoreConfig;
