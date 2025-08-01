import { createReactLibraryConfig } from '@tspdf/rollup-config/react-internal';

const reactPdfConfig = await createReactLibraryConfig({
  input: 'src/index.tsx',
  packageJsonPath: './package.json',
  minify: false,
  copyPdfCore: true,
});

export default reactPdfConfig;
