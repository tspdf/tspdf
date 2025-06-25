import { createReactLibraryConfig } from '@tspdf/rollup-config/react-internal';
import { dirname, resolve } from 'path';
import copy from 'rollup-plugin-copy';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const licenseFile = resolve(__dirname, '../../licenses/pdfjs-dist.txt');

const reactPdfConfig = createReactLibraryConfig({
  input: 'src/index.tsx',
  packageJsonPath: './package.json',
  minify: true,
  plugins: [
    copy({
      targets: [
        {
          src: licenseFile,
          dest: 'dist/licenses',
        },
      ],
      hook: 'writeBundle',
    }),
  ],
});

export default reactPdfConfig;
