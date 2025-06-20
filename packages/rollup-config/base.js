import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import fs from 'fs';
import path from 'path';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

/**
 * Create output configurations for Node.js (ESM + CJS)
 */
export function createNodeOutputConfig(outputDir) {
  return [
    {
      file: `${outputDir}/index.esm.js`,
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: `${outputDir}/index.cjs`,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
  ];
}

/**
 * Create UMD output configuration
 */
export function createUmdOutputConfig(outputDir, umdName, globals = {}) {
  return {
    file: `${outputDir}/index.umd.js`,
    format: 'umd',
    name: umdName,
    globals,
    sourcemap: true,
    exports: 'named',
  };
}

/**
 * Create base configuration for packages
 */
export function createBaseConfig(options) {
  const {
    input,
    packageJsonPath,
    outputDir = 'dist',
    minify = true,
    target = 'es2024',
    external = [],
    plugins = [],
  } = options;

  const projectDir = process.cwd();
  const pkg = JSON.parse(
    fs.readFileSync(path.resolve(projectDir, packageJsonPath), 'utf8'),
  );
  const resolvedInput = path.resolve(projectDir, input);

  // External dependencies (don't bundle deps and peerDeps)
  const defaultExternal = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    ...external,
  ];

  // Base plugins
  const basePlugins = [
    del({ targets: `${outputDir}/*`, runOnce: true }),
    resolve({ preferBuiltins: true }),
    commonjs(),
    esbuild({
      target,
      minify,
      sourcemap: true,
      jsx: 'automatic',
      define: {
        'process.env.NODE_ENV': JSON.stringify(
          minify ? 'production' : 'development',
        ),
      },
    }),
    ...plugins,
  ];

  return {
    pkg,
    resolvedInput,
    defaultExternal,
    basePlugins,
    outputDir,
  };
}

/**
 * Create TypeScript declarations configuration
 */
export function createTypeScriptDeclarationsConfig(input, outputDir) {
  return {
    input,
    output: {
      file: `${outputDir}/index.d.ts`,
      format: 'es',
    },
    plugins: [dts()],
    external: [/\.css$/, /node_modules/],
  };
}
