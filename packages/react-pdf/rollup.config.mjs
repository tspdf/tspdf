import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import postcssTailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';
import del from 'rollup-plugin-delete';

// __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load package.json without import assertions
const pkg = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, 'package.json'),
    'utf8'
  )
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
      'react/jsx-runtime'
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
        jsx: 'automatic'
      }),

      // Tailwind + PostCSS pipeline
      postcss({
        extract: true,
        modules: false,
        sourceMap: true,
        plugins: [
          postcssTailwind(),
          autoprefixer(),
        ],
        extensions: ['.css'],
      }),
    ],
    output: [
      {
        file: path.join(outputDir, pkg.module),
        format: 'es',
        sourcemap: true,
      },
      {
        file: path.join(outputDir, pkg.main),
        format: 'umd',
        name: 'EasyPDF',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime'
        },
        sourcemap: true,
      }
    ]
  },

  // 2) Type Declarations
  {
    input,
    external: [/\.css$/],
    plugins: [
      dts({
        tsconfig: './tsconfig.json'
      })
    ],
    output: {
      file: path.join(outputDir, 'types/index.d.ts'),
      format: 'es'
    }
  }
];
