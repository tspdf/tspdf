import { isBrowser } from '../utils';
import { PDFJS } from './types';

// Module cache to avoid re-loading PDF.js
let pdfjsModule: PDFJS | null = null;
let loadingPromise: Promise<PDFJS> | null = null;

/**
 * Dynamically loads PDF.js library and configures the worker.
 * Uses CDN worker for better performance and caching.
 */
export async function loadPdfjs(): Promise<PDFJS> {
  if (pdfjsModule) {
    return pdfjsModule;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  if (!isBrowser()) {
    throw new Error(
      'PDF.js can only be loaded in browser environments. Please ensure you are running this code in a browser context.',
    );
  }

  loadingPromise = (async () => {
    try {
      const pdfjs = await import('pdfjs-dist');

      // Configure worker from CDN to match the loaded version
      const version = pdfjs.version;
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.mjs`;

      pdfjsModule = {
        getDocument: pdfjs.getDocument,
      };

      return pdfjsModule;
    } catch (error) {
      loadingPromise = null;
      throw new Error(
        `Failed to load PDF.js: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  })();

  return loadingPromise;
}
