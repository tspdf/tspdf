import { createReactLibraryConfig } from '@tspdf/rollup-config/react-internal';
import copy from 'rollup-plugin-copy';

const reactPdfConfig = createReactLibraryConfig({
  input: 'src/index.tsx',
  packageJsonPath: './package.json',
  minify: true,
  tailwindContent: ['./src/**/*.{js,ts,jsx,tsx}'],
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
