# @tspdf/rollup-config

**Internal workspace package** providing optimized Rollup configurations for TSPDF packages.

## Purpose

This package is an **internal build tool** used exclusively within the TSPDF workspace to provide standardized, optimized Rollup configurations for:

- **React Libraries** (`react-pdf`, etc.)
- **etc.**

## Key Features

- 🚀 **Modern JavaScript**: ES2022 target with advanced tree-shaking
- 📦 **Multiple Formats**: ESM, CJS, UMD builds optimized per environment
- 🔧 **TypeScript**: Full declaration generation and source map support
- ⚡ **Fast Builds**: esbuild-powered compilation with memory optimization
- 🔗 **Workspace Integration**: Smart bundling of workspace dependencies from source

## Available Configurations

| Type             | Purpose                      | Import Path                           |
| ---------------- | ---------------------------- | ------------------------------------- |
| `base`           | Core utilities and functions | `@tspdf/rollup-config/base`           |
| `react-internal` | React component libraries    | `@tspdf/rollup-config/react-internal` |
