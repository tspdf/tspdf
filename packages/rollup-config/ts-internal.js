import {
  createBaseConfig,
  createNodeOutputConfig,
  createTypeScriptDeclarationsConfig,
  createWorkspaceAlias,
} from './base.js';

/**
 * Create TypeScript library configuration for internal packages
 */
export function createTypeScriptLibraryConfig(options) {
  const {
    input,
    packageJsonPath,
    outputDir = 'dist',
    minify = true,
    target = 'es2024',
    bundledDependencies = [],
  } = options;

  // Get base configuration
  const baseConfig = createBaseConfig({
    input,
    packageJsonPath,
    outputDir,
    minify,
    target,
    plugins: [createWorkspaceAlias(bundledDependencies)],
  });

  const { resolvedInput, basePlugins, outputDir: outDir } = baseConfig;

  // External function that bundles workspace dependencies
  const getExternal = bundledDeps => id => {
    if (bundledDeps.some(dep => id === dep || id.startsWith(`${dep}/`))) {
      return false;
    }
    // Bundle all dependencies for internal packages
    return /^node:/.test(id) || /^@?[a-z]/.test(id);
  };

  return [
    // ESM + CJS for Node.js/bundlers
    {
      input: resolvedInput,
      output: createNodeOutputConfig(outDir),
      plugins: [...basePlugins],
      external: getExternal(bundledDependencies),
      treeshake: { moduleSideEffects: false },
    },

    // TypeScript declarations
    createTypeScriptDeclarationsConfig(resolvedInput, outDir),
  ];
}
