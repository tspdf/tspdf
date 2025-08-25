import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import tailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import { dirname, isAbsolute } from 'path';
import postcssImport from 'postcss-import';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const jsPlugins = [
  // Clean output dir each build to avoid stale files
  del({ targets: 'dist/*', runOnce: false }),
  alias({ entries: [] }),
  resolve({
    browser: true,
    preferBuiltins: false,
    extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'],
  }),
  commonjs(),
  esbuild({
    target: 'es2022',
    sourceMap: false,
    minify: true,
    tsconfig: 'tsconfig.json',
  }),
];

const mainBuild = {
  input: 'src/index.tsx',
  external: id => {
    // Keep relative and absolute imports internal; externalize peer deps (react)
    if (id.startsWith('.') || isAbsolute(id) || id.startsWith('file:'))
      return false;
    if (id.startsWith('react')) return true;
    if (id === '@tspdf/pdf-core') return true; // external; path remapped to local copy in output.paths
    return false;
  },
  output: {
    file: 'dist/index.esm.js',
    format: 'esm',
    sourcemap: false,
    paths: {
      '@tspdf/pdf-core': './pdf-core/index.esm.js',
    },
  },
  plugins: [
    ...jsPlugins,
    postcss({
      extract: false,
      minimize: true,
      modules: false,
      plugins: [
        postcssImport(),
        tailwind({
          config: fileURLToPath(
            new URL('./tailwind.config.js', import.meta.url),
          ),
        }),
        autoprefixer(),
      ],
    }),
    copy({
      targets: [
        // Copy only what we need: ESM entry, types, and the pdfjs shim
        { src: '../pdf-core/dist/index.esm.js', dest: 'dist/pdf-core' },
        { src: '../pdf-core/dist/index.d.ts', dest: 'dist/pdf-core' },
        {
          src: '../pdf-core/dist/pdfjs-dist/**/*',
          dest: 'dist/pdf-core/pdfjs-dist',
        },
      ],
      hook: 'writeBundle',
      copyOnce: true,
    }),
  ],
  treeshake: {
    moduleSideEffects: id => /\.css$/i.test(id),
  },
};

const dtsBuild = {
  input: 'src/index.tsx',
  output: { file: 'dist/index.d.ts', format: 'es' },
  plugins: [
    // Ignore CSS imports in type build
    {
      name: 'ignore-css-in-dts',
      resolveId(id) {
        if (id.endsWith('.css')) return id;
        return null;
      },
      load(id) {
        if (id.endsWith('.css')) return 'export {}';
        return null;
      },
    },
    dts(),
  ],
};

export default [mainBuild, dtsBuild];
