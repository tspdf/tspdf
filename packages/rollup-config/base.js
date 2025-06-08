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
 * Creates a generic workspace root finder function
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
 * Creates Node.js output configuration (ESM + CJS)
 * @param {string} outputDir - Output directory
 * @param {Object} options - Additional options
 * @param {boolean} options.preserveModules - Whether to preserve modules for tree-shaking
 * @param {string} options.entryName - Entry file name (defaults to 'index')
 * @returns {Array} Array of output configurations
 */
export function createNodeOutputConfig(outputDir, options = {}) {
  const { preserveModules = false, entryName = 'index' } = options;

  const baseConfig = {
    sourcemap: true,
    exports: 'named',
    interop: 'auto',
    generatedCode: {
      constBindings: true,
      arrowFunctions: true,
      objectShorthand: true,
    },
  };

  if (preserveModules) {
    return [
      // ESM with preserved modules for better tree-shaking
      {
        ...baseConfig,
        dir: `${outputDir}/esm`,
        format: 'esm',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
      // CJS
      {
        ...baseConfig,
        file: `${outputDir}/lib/${entryName}.cjs`,
        format: 'cjs',
      },
    ];
  }

  return [
    // ESM
    {
      ...baseConfig,
      file: `${outputDir}/lib/${entryName}.esm.js`,
      format: 'esm',
    },
    // CJS
    {
      ...baseConfig,
      file: `${outputDir}/lib/${entryName}.cjs`,
      format: 'cjs',
    },
  ];
}

/**
 * Creates UMD output configuration
 * @param {string} outputDir - Output directory
 * @param {string} umdName - UMD global variable name
 * @param {Object} globals - UMD globals mapping
 * @param {Object} options - Additional options
 * @param {string} options.entryName - Entry file name (defaults to 'index')
 * @returns {Array} Array of UMD output configurations
 */
export function createUmdOutputConfig(
  outputDir,
  umdName,
  globals = {},
  options = {},
) {
  const { entryName = 'index' } = options;

  return [
    {
      file: `${outputDir}/lib/${entryName}.umd.js`,
      format: 'umd',
      name: umdName,
      globals,
      sourcemap: true,
      exports: 'named',
      interop: 'auto',
      generatedCode: {
        constBindings: true,
        arrowFunctions: true,
        objectShorthand: true,
      },
    },
  ];
}

/**
 * Creates browser-optimized output configuration
 * @param {string} outputDir - Output directory
 * @param {string} umdName - UMD global variable name
 * @param {Object} globals - UMD globals mapping
 * @param {Object} options - Additional options
 * @returns {Array} Array of browser output configurations
 */
export function createBrowserOutputConfig(
  outputDir,
  umdName,
  globals = {},
  options = {},
) {
  const { entryName = 'index' } = options;

  return [
    // Browser ESM
    {
      file: `${outputDir}/browser/${entryName}.esm.js`,
      format: 'esm',
      sourcemap: true,
      generatedCode: {
        constBindings: true,
        arrowFunctions: true,
        objectShorthand: true,
      },
    },
    // Browser UMD (for script tags)
    {
      file: `${outputDir}/browser/${entryName}.umd.js`,
      format: 'umd',
      name: umdName,
      globals,
      sourcemap: true,
      exports: 'named',
      interop: 'auto',
      generatedCode: {
        constBindings: true,
        arrowFunctions: true,
        objectShorthand: true,
      },
    },
  ];
}

/**
 * Creates enhanced resolve configuration for better module resolution
 * @param {Object} options - Resolve options
 * @param {boolean} options.browser - Whether to optimize for browser
 * @param {Array} options.exportConditions - Export conditions to use
 * @param {Array} options.dedupe - Packages that should be deduped (singletons)
 * @returns {Object} Enhanced resolve configuration
 */
export function createResolveConfig(options = {}) {
  const {
    browser = false,
    exportConditions = ['import', 'module', 'default'],
    dedupe = [],
  } = options;

  return {
    preferBuiltins: !browser,
    browser,
    exportConditions,
    dedupe,
  };
}

/**
 * Base configuration for all TSPDF rollup builds
 * @param {Object} options - Configuration options
 * @param {string} options.input - Entry point file path
 * @param {string} options.packageJsonPath - Path to package.json file
 * @param {string} [options.outputDir] - Output directory (defaults to 'dist')
 * @param {boolean} [options.minify] - Whether to minify output (defaults to true)
 * @param {string} [options.target] - esbuild target (defaults to 'es2024')
 * @param {Array} [options.external] - External dependencies to exclude from bundle
 * @param {Array} [options.plugins] - Additional plugins to include
 * @param {boolean} [options.treeshake] - Enable tree-shaking optimizations (defaults to true)
 * @param {boolean} [options.preserveModules] - Preserve module structure for better tree-shaking
 * @param {boolean} [options.browser] - Whether to optimize for browser environment
 * @param {Array} [options.dedupe] - Packages that should be deduped (singletons)
 * @returns {Object} Base configuration object with common settings
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
    treeshake = true,
    preserveModules = false,
    browser = false,
    dedupe = [],
  } = options;

  // Get the project directory
  const projectDir = process.cwd();

  // Load package.json
  const pkg = JSON.parse(
    fs.readFileSync(path.resolve(projectDir, packageJsonPath), 'utf8'),
  );

  const resolvedInput = path.resolve(projectDir, input);

  // Default external dependencies (don't bundle dependencies and peerDependencies)
  const defaultExternal = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    ...external,
  ];

  // Enhanced tree-shaking configuration
  const treeshakeConfig = treeshake
    ? {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
        tryCatchDeoptimization: false,
      }
    : false;

  // Esbuild configuration - focus on transpilation, not format conversion
  const esbuildConfig = {
    target,
    minify,
    sourcemap: true,
    platform: browser ? 'browser' : 'neutral',
    keepNames: !minify,
    define: {
      'process.env.NODE_ENV': JSON.stringify(
        minify ? 'production' : 'development',
      ),
    },
    // Use more JSX transform
    jsx: 'automatic',
    jsxDev: !minify,
  };

  // Common plugins used across all configurations
  const basePlugins = [
    del({ targets: `${outputDir}/*`, runOnce: true }),
    resolve(createResolveConfig({ browser, dedupe })),
    commonjs({
      ignoreTryCatch: false,
      requireReturnsDefault: 'auto',
      // Enhanced CommonJS handling to avoid conversion warnings
      transformMixedEsModules: true,
      strictRequires: true,
    }),
    esbuild(esbuildConfig),
    // ...other plugins from options
    ...plugins,
  ];

  return {
    pkg,
    projectDir,
    resolvedInput,
    defaultExternal,
    basePlugins,
    outputDir,
    target,
    minify,
    treeshakeConfig,
    preserveModules,
    browser,
  };
}

/**
 * Creates TypeScript declarations configuration
 * @param {string} input - Input file path
 * @param {string} outputDir - Output directory
 * @param {Object} options - Additional options
 * @param {boolean} options.respectExternal - Respect external dependencies in declarations
 * @param {Array} options.bundledDependencies - Dependencies that are bundled and should be included in declarations
 * @returns {Object} TypeScript declarations configuration
 */
export function createTypeScriptDeclarationsConfig(
  input,
  outputDir,
  options = {},
) {
  const { respectExternal = true, bundledDependencies = [] } = options;

  // Base externals for file types and node_modules
  const baseExternals = [
    /\.css$/,
    /\.scss$/,
    /\.less$/,
    /\.styl$/,
    /node_modules/,
  ];

  return {
    input,
    output: {
      file: `${outputDir}/types/index.d.ts`,
      format: 'es',
    },
    plugins: [
      dts({
        respectExternal,
        compilerOptions: {
          preserveSymlinks: false,
          // Add memory optimization settings
          skipLibCheck: true,
          incremental: false,
        },
      }),
    ],
    // Externalize patterns, but include bundled dependencies if specified
    external: respectExternal
      ? [
          ...baseExternals,
          ...bundledDependencies.map(dep => new RegExp(`^${dep}`)),
        ]
      : baseExternals,
  };
}

/**
 * Creates a generic file copy configuration
 * @param {string} outputDir - Output directory
 * @param {Array} copyTargets - Array of copy targets { src, dest }
 * @returns {Object} Rollup config that copies files and does nothing else
 */
export function createFileCopyConfig(outputDir, copyTargets = []) {
  if (copyTargets.length === 0) {
    return null;
  }

  return {
    input: 'virtual:copy-only', // Virtual input for copy-only builds
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
        copyOnce: true, // Only copy once per build
      }),
      {
        name: 'cleanup-dummy',
        writeBundle() {
          // Clean up the dummy file after copy is complete
          try {
            const dummyFile = `${outputDir}/.rollup-dummy.js`;
            if (fs.existsSync(dummyFile)) {
              fs.unlinkSync(dummyFile);
            }
          } catch {
            // Ignore cleanup errors
          }
        },
      },
    ],
    output: {
      file: `${outputDir}/.rollup-dummy.js`,
      format: 'es',
    },
    onwarn() {}, // Suppress warnings for this dummy build
    external: () => true,
  };
}

/**
 * Workspace resolver using @rollup/plugin-alias
 * Resolves workspace dependencies to their source files for optimal bundling
 *
 * @param {Array|Object} bundledDependencies - Dependencies to bundle from source
 *   - Array: ['@tspdf/pdf-core'] - uses default entry point discovery
 *   - Object: { '@tspdf/pdf-core': 'src/index.ts', '@tspdf/utils': 'src/main.js' }
 * @param {Object} options - Configuration options
 * @param {string} options.workspaceScope - Workspace scope prefix (default: '@tspdf/')
 * @param {string} options.packagesDir - Packages directory name (default: 'packages')
 * @param {Array} options.defaultEntryPoints - Default entry points to try (default: ['src/index.ts', 'src/index.tsx', 'src/index.js', 'src/index.jsx'])
 * @returns {Object} Rollup alias plugin that resolves workspace dependencies to source files
 */
export function createWorkspaceAlias(bundledDependencies = [], options = {}) {
  const {
    workspaceScope = '@tspdf/',
    packagesDir = 'packages',
    defaultEntryPoints = [
      'src/index.ts',
      'src/index.tsx',
      'src/index.js',
      'src/index.jsx',
    ],
  } = options;

  const workspaceRoot = findWorkspaceRoot();
  const entries = [];

  // Normalize input to object format
  const depMap = Array.isArray(bundledDependencies)
    ? Object.fromEntries(bundledDependencies.map(dep => [dep, null]))
    : bundledDependencies;

  for (const [dep, customEntryPoint] of Object.entries(depMap)) {
    const packageName = dep.replace(workspaceScope, '');
    const packagePath = path.join(workspaceRoot, packagesDir, packageName);

    // If custom entry point is specified, use it directly
    if (customEntryPoint) {
      const customPath = path.join(packagePath, customEntryPoint);
      if (fs.existsSync(customPath)) {
        entries.push({
          find: dep,
          replacement: customPath,
        });
        continue;
      }
      console.warn(
        `Custom entry point ${customEntryPoint} not found for ${dep}, falling back to auto-discovery`,
      );
    }

    // Auto-discovery: try default entry points
    let found = false;
    for (const entryPoint of defaultEntryPoints) {
      const entryPath = path.join(packagePath, entryPoint);
      if (fs.existsSync(entryPath)) {
        entries.push({
          find: dep,
          replacement: entryPath,
        });
        found = true;
        break;
      }
    }

    if (!found) {
      console.warn(`No entry point found for workspace dependency: ${dep}`);
    }
  }

  return alias({ entries });
}
