import { createReactLibraryConfig } from '@tspdf/rollup-config/react-internal';

const reactPdfConfig = await createReactLibraryConfig({
  input: 'src/index.tsx',
  packageJsonPath: './package.json',
  minify: true,
  copyPdfCore: true,
});

export default reactPdfConfig;
