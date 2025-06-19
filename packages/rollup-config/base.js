import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import fs from 'fs';
import path from 'path';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

/**
 * Find workspace root by looking for package.json with workspaces
 */
export function findWorkspaceRoot() {
  let dir = process.cwd();
  const { root } = path.parse(dir);

  while (dir !== root) {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.workspaces) return dir;
      } catch {
        // ignore parse errors
      }
    }
    dir = path.dirname(dir);
  }

  return process.cwd();
}

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

/**
 * Create file copy configuration
 */
export function createFileCopyConfig(outputDir, copyTargets = []) {
  if (copyTargets.length === 0) {
    return null;
  }

  return {
    input: 'virtual:copy-only',
    plugins: [
      {
        name: 'virtual-copy-only',
        resolveId(id) {
          if (id === 'virtual:copy-only') return id;
          return null;
        },
        load(id) {
          if (id === 'virtual:copy-only') return 'export {};';
          return null;
        },
      },
      copy({
        targets: copyTargets.map(target => ({
          src: target.src,
          dest: target.dest || outputDir,
        })),
        hook: 'writeBundle',
      }),
      {
        name: 'cleanup-temp',
        writeBundle() {
          // Clean up temp file
          try {
            const tempFile = `${outputDir}/.temp-copy.js`;
            if (fs.existsSync(tempFile)) {
              fs.unlinkSync(tempFile);
            }
          } catch {
            // ignore cleanup errors
          }
        },
      },
    ],
    output: {
      file: `${outputDir}/.temp-copy.js`,
      format: 'es',
    },
    external: () => true,
  };
}

/**
 * Create workspace alias resolver
 */
export function createWorkspaceAlias(bundledDependencies = []) {
  const workspaceRoot = findWorkspaceRoot();
  const entries = [];

  for (const dep of bundledDependencies) {
    const packageName = dep.replace('@tspdf/', '');
    const packagePath = path.join(workspaceRoot, 'packages', packageName);

    // Try common entry points
    const entryPoints = ['src/index.ts', 'src/index.tsx', 'src/index.js'];

    for (const entryPoint of entryPoints) {
      const entryPath = path.join(packagePath, entryPoint);
      if (fs.existsSync(entryPath)) {
        entries.push({
          find: dep,
          replacement: entryPath,
        });
        break;
      }
    }
  }

  return alias({ entries });
}
