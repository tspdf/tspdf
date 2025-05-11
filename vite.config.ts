import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    cssInjectedByJsPlugin({
      topExecutionPriority: true,
      cssAssetsFilterFunction: (asset) => {
        return asset.fileName.endsWith(".css");
      },
    }),
    react(),
    tsconfigPaths(),
    tailwindcss(),
    dts({
      outputDir: "dist/types",
      tsConfigFilePath: "./tsconfig.json",
      insertTypesEntry: true,
      skipDiagnostics: false,
      rollupTypes: true,
    }),
  ],
  build: {
    sourcemap: true,
    minify: "esbuild",
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: "EasyPDF",
      formats: ["es", "umd"],
      fileName: (format) => `easy-pdf.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "tailwindcss"],
      output: {
        globals: { react: "React", "react-dom": "ReactDOM" },
        assetFileNames: "[name].[hash][extname]",
      },
    },
  },
});
