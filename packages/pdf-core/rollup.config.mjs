import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { dirname } from 'path';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Shared JS build options (without delete plugin)
const jsPlugins = [
  alias({
    entries: [],
  }),
  resolve({ browser: true, preferBuiltins: false }),
  commonjs(),
  esbuild({
    sourceMap: false,
    minify: true,
    target: 'es2022',
    tsconfig: 'tsconfig.json',
  }),
];

// 1) Main library build (does NOT inline pdfjs; it imports our local shim at ./pdfjs-dist/index.js)
const mainBuild = {
  input: 'src/index.ts',
  external: id => {
    if (id === 'pdfjs-dist') return true; // remapped via output.paths to our local bundled shim
    if (id.startsWith('node:')) return true;
    return false;
  },
  output: {
    file: 'dist/index.esm.js',
    format: 'esm',
    sourcemap: false,
    // Keep dynamic imports (like import('./pdfjs-dist/index.js')) untouched
    inlineDynamicImports: false,
    paths: {
      'pdfjs-dist': './pdfjs-dist/index.js',
    },
  },
  plugins: [
    // Clean output dir only once at the start
    del({ targets: 'dist/*', runOnce: true }),
    ...jsPlugins,
  ],
  treeshake: {
    moduleSideEffects: false,
  },
};

// 2) PDF.js shim build: bundles pdfjs-dist into dist/pdfjs-dist/index.js
const pdfjsShimBuild = {
  input: 'src/pdfjs-bundle.ts',
  external: [], // bundle everything for the shim, including pdfjs-dist
  plugins: [...jsPlugins],
  output: {
    file: 'dist/pdfjs-dist/index.js',
    format: 'esm',
    sourcemap: false,
  },
};

// 3) Type declarations
const dtsBuild = {
  input: 'src/index.ts',
  output: { file: 'dist/index.d.ts', format: 'es' },
  plugins: [dts()],
};

export default [mainBuild, pdfjsShimBuild, dtsBuild];
