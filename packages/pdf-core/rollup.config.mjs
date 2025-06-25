import { createTypeScriptLibraryConfig } from '@tspdf/rollup-config/ts-internal';

const pdfCoreConfig = createTypeScriptLibraryConfig({
  input: 'src/index.ts',
  packageJsonPath: './package.json',
  minify: true,
  filename: 'index.esm.js',
});

export default pdfCoreConfig;
