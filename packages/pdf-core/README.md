# PDF Core

Internal workspace package that provides a consistent PDF.js wrapper for TSPDF packages.

## Purpose

This is an **internal-only** package designed to be bundled from source into consumer packages like `@tspdf/react-pdf`, etc. It is not published to npm and should not be used directly by end users.

## Features

- **Source-Only Distribution**: No built output - bundled directly from TypeScript source
- **Structured Exports**: Modular architecture for optimal tree-shaking when bundled
- **PDF.js Abstraction**: Consistent interface for PDF document manipulation across frameworks
- **Type Safety**: Full TypeScript definitions for all modules
- **Framework Agnostic**: Core PDF functionality independent of UI frameworks

## Architecture

This package serves as the shared PDF processing layer that gets bundled into framework-specific packages:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   @tspdf/       │    │   @tspdf/       │    │   @tspdf/       │
│   react-pdf     │    │   vue-pdf       │    │   angular-pdf   │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  pdf-core   │ │    │ │  pdf-core   │ │    │ │  pdf-core   │ │
│ │  (bundled)  │ │    │ │  (bundled)  │ │    │ │  (bundled)  │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Build Configuration

This package is configured as **source-only**

**Key Points:**

- ✅ **No Build Step**: Source files are used directly
- ✅ **Bundle Target**: Gets compiled when bundled into consumer packages
- ✅ **Tree-Shakeable**: Modular exports enable optimal bundling
- ✅ **Type Resolution**: TypeScript definitions point to source files

## Bundling Process

When framework packages build, the workspace resolver:

1. **Resolves Import**: `@tspdf/pdf-core` → `packages/pdf-core/src/index.ts`
2. **Bundles Source**: TypeScript source gets compiled and bundled
3. **Includes PDF.js**: Brings in required PDF.js dependencies
4. **Tree-Shakes**: Only used functions are included in final bundle
5. **Optimizes**: Source-level optimizations and minification applied

## Dependencies

This package uses [PDF.js](https://github.com/mozilla/pdf.js) (pdfjs-dist) under the Apache 2.0 License for PDF rendering capabilities. When bundled into framework packages, PDF.js code is included and the Apache 2.0 license is preserved in the distribution.

## Development

```bash
# Install dependencies
yarn install

# Linting
yarn lint

# Linting and Format
yarn lint:fix
```

**Note**: This package has no build step. Changes to source files are immediately available to consuming packages.

## License

This package is licensed under the MIT License. See the [LICENSE](../../LICENSE) file for details.

PDF.js dependency is licensed under the Apache 2.0 License. When bundled into framework packages, the PDF.js license is preserved in `dist/licenses/pdfjs-dist.txt`.
