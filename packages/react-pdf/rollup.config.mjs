import {
  createFileCopyConfig,
  findWorkspaceRoot,
} from '@tspdf/rollup-config/base';
import { createReactLibraryConfig } from '@tspdf/rollup-config/react-internal';
import path from 'path';

const reactPdfConfig = createReactLibraryConfig({
  input: 'src/index.tsx',
  packageJsonPath: './package.json',
  minify: true,
  umdName: 'TSPDFReact', // Specific to this package
  // Bundle pdf-core by treating it as non-external
  bundledDependencies: ['@tspdf/pdf-core'],
  globals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react/jsx-runtime': 'jsxRuntime',
    'react/jsx-dev-runtime': 'jsxDevRuntime',
    // pdf-core will be bundled, so no global needed
  },
});

// Add license copying for bundled dependencies (PDF.js via pdf-core)
const licenseCopyConfig = createFileCopyConfig('dist', [
  {
    src: path.resolve(findWorkspaceRoot(), 'licenses/pdfjs-dist.txt'),
    dest: 'dist/licenses',
  },
]);

export default licenseCopyConfig
  ? [...reactPdfConfig, licenseCopyConfig]
  : reactPdfConfig;
