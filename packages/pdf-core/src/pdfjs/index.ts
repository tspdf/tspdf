import { isBrowser } from '../utils';
import { PDFJS } from './types';

// Cache for the loaded PDF.js module
let pdfjsModule: PDFJS | null = null;
let loadingPromise: Promise<PDFJS> | null = null;

export async function loadPdfjs(): Promise<PDFJS> {
  // Return cached module if already loaded
  if (pdfjsModule) {
    return pdfjsModule;
  }

  // Return existing loading promise if already in progress
  if (loadingPromise) {
    return loadingPromise;
  }

  // Throw error if not in browser environment
  if (!isBrowser()) {
    throw new Error(
      'PDF.js can only be loaded in browser environments. Please ensure you are running this code in a browser context.',
    );
  }

  loadingPromise = (async () => {
    try {
      const pdfjs = await import('pdfjs-dist');

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
