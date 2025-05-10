import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import path from 'path';
import autoprefixer from 'autoprefixer';
import postcssPlugin from '@tailwindcss/postcss';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      root: path.resolve(__dirname, 'src'),
      entryRoot: path.resolve(__dirname, 'src/components'),
      outputDir: path.resolve(__dirname, 'dist/types'),
      tsConfigFilePath: path.resolve(__dirname, 'tsconfig.json'),
      insertTypesEntry: true,
      skipDiagnostics: false,
    }),
  ],
  css: {
    postcss: {
      plugins: [
        postcssPlugin(),
        autoprefixer(),
      ],
    },
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/components/index.tsx'),
      name: 'EasyPDF',
      formats: ['es', 'umd'],
      fileName: (format) => `easy-pdf.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: { react: 'React', 'react-dom': 'ReactDOM' }
      }
    }
  }
});
