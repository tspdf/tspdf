import fs from 'fs';
import path from 'path';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  esbuildPlugins: [
    {
      name: 'copy-licenses',
      setup(build) {
        build.onEnd(() => {
          // Copy PDF.js license for legal compliance
          const licensesDir = path.join('dist', 'licenses');
          const sourceFile = path.resolve('../../licenses/pdfjs-dist.txt');
          const targetFile = path.join(licensesDir, 'pdfjs-dist.txt');

          if (!fs.existsSync(licensesDir)) {
            fs.mkdirSync(licensesDir, { recursive: true });
          }

          if (fs.existsSync(sourceFile)) {
            fs.copyFileSync(sourceFile, targetFile);
            console.log('✓ Copied PDF.js license to dist/licenses/');
          } else {
            console.warn('⚠ PDF.js license file not found at:', sourceFile);
          }
        });
      },
    },
  ],
});
