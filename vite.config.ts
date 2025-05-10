import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/components/index.tsx'),
      name: 'EasyPDF',
      fileName: (format) => `easy-pdf.${format}.js`,
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      // Externalize deps that shouldn't be bundled into the library
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  plugins: [react(), dts({ rollupTypes: true })],
})
