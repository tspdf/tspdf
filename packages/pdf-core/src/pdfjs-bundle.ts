// This file bundles pdfjs-dist into a single ESM file under dist/pdfjs-dist/index.js
// It re-exports only the API we use, keeping surface minimal.
import * as pdfjs from 'pdfjs-dist';

export const version = (pdfjs as any).version as string;
export const GlobalWorkerOptions = (pdfjs as any).GlobalWorkerOptions as {
  workerSrc: string;
};
export const getDocument = (pdfjs as any)
  .getDocument as typeof import('pdfjs-dist').getDocument;
