import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import postcssTailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import fs from 'fs';
import path from 'path';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { fileURLToPath } from 'url';

// __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load package.json without import assertions
const pkg = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'),
);

const input = path.resolve(__dirname, 'src/index.tsx');
const outputDir = path.resolve(__dirname, 'dist');

export default [
  // 1) Bundle (ESM + UMD)
  {
    input,
    external: [
      ...Object.keys(pkg.peerDependencies || {}),
      'tailwindcss',
      'react/jsx-runtime',
    ],
    plugins: [
      // Clean dist before build
      del({ targets: 'dist/*', runOnce: true }),

      // Auto-externalize peerDependencies
      peerDepsExternal(),

      // Resolve node modules & CommonJS conversion
      resolve(),
      commonjs(),

      // TSX/TS via esbuild
      esbuild({
        sourceMap: true,
        minify: true,
        target: 'esnext',
        jsx: 'automatic',
      }),

      // Tailwind + PostCSS pipeline
      postcss({
        extract: false,
        modules: false,
        sourceMap: true,
        plugins: [postcssTailwind(), autoprefixer()],
        extensions: ['.css'],
      }),
    ],
    output: [
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
      {
        file: pkg.main,
        format: 'umd',
        name: 'TSPDF',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
        sourcemap: true,
      },
    ],
  },

  // 2) Type Declarations
  {
    input,
    external: [/\.css$/],
    plugins: [
      dts({
        tsconfig: './tsconfig.json',
      }),
      // Copy license files for legal compliance
      {
        name: 'copy-licenses',
        generateBundle() {
          // Copy the Apache 2.0 license for PDF.js dependency
          const licensesDir = path.join(outputDir, 'licenses');
          const sourceFile = path.resolve(
            __dirname,
            '../../licenses/pdfjs-dist.txt',
          );
          const targetFile = path.join(licensesDir, 'pdfjs-dist.txt');

          if (!fs.existsSync(licensesDir)) {
            fs.mkdirSync(licensesDir, { recursive: true });
          }

          if (fs.existsSync(sourceFile)) {
            fs.copyFileSync(sourceFile, targetFile);
            console.log('✓ Copied PDF.js license to dist/licenses/');
          }
        },
      },
    ],
    output: {
      file: path.join(outputDir, 'types/index.d.ts'),
      format: 'es',
    },
  },
];
