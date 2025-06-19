import { createTypeScriptLibraryConfig } from '@tspdf/rollup-config/ts-internal';

const pdfCoreConfig = createTypeScriptLibraryConfig({
  input: 'src/index.ts',
  packageJsonPath: './package.json',
  minify: true,
});

export default pdfCoreConfig;
