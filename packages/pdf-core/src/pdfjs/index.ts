import { isBrowser } from '../utils';
import { PDFDocumentProxy, TextLayer, TextLayerParameters } from './types';

type pdfjs = typeof import('pdfjs-dist');

// Module cache to avoid re-loading PDF.js
let pdfjsCache: pdfjs | null = null;
let loadingPromise: Promise<void> | null = null;

/**
 * Dynamically loads PDF.js library and configures the worker.
 * Uses CDN worker for better performance and caching.
 */
async function pdfjsLoad(): Promise<void> {
  if (pdfjsCache) {
    return;
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

      pdfjsCache = pdfjs;
    } catch (error) {
      loadingPromise = null;
      throw new Error(
        `Failed to load PDF.js: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  })();

  return loadingPromise;
}

/**
 * Gets the loaded PDF.js module.
 * Throws if PDF.js hasn't been loaded yet.
 */
function pdfjsGet(): pdfjs {
  if (!pdfjsCache) {
    throw new Error(
      'PDF.js not loaded. Call pdfjsLoad() first and await its completion.',
    );
  }
  return pdfjsCache;
}

export async function getDocument(url: string): Promise<PDFDocumentProxy> {
  await pdfjsLoad();
  const pdfjs = pdfjsGet();
  const loadingTask = pdfjs.getDocument(url);
  const pdfDocument = await loadingTask.promise;

  return pdfDocument as PDFDocumentProxy;
}

export function createTextLayer(params: TextLayerParameters): TextLayer {
  const pdfjs = pdfjsGet();
  return new pdfjs.TextLayer(params);
}
