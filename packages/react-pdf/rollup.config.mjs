import { createReactLibraryConfig } from '@tspdf/rollup-config/react-internal';
import copy from 'rollup-plugin-copy';

const reactPdfConfig = createReactLibraryConfig({
  input: 'src/index.tsx',
  packageJsonPath: './package.json',
  minify: true,
  umdName: 'TSPDFReact',
  globals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react/jsx-runtime': 'jsxRuntime',
    'react/jsx-dev-runtime': 'jsxDevRuntime',
    'pdfjs-dist': 'pdfjsLib',
  },
  plugins: [
    copy({
      targets: [
        {
          src: '../../licenses/pdfjs-dist.txt',
          dest: 'dist/licenses',
        },
      ],
      hook: 'writeBundle',
    }),
  ],
});

export default reactPdfConfig;
