import type { PDFDocumentProxy } from "pdfjs-dist";
import {
  getDocument,
  GlobalWorkerOptions,
  version as pdfjsVersion,
} from "pdfjs-dist";
import type { DocumentInitParameters } from "pdfjs-dist/types/src/display/api";

/**
 * The PDF.js version used by this library.
 */
export const version = pdfjsVersion;

/**
 * Sets the worker source URL for PDF.js.
 * @param src URL of the PDF.js worker script
 */
export function setWorkerSrc(src: string): void {
  GlobalWorkerOptions.workerSrc = src;
}

/**
 * Loads a PDF document from a URL.
 * @param url The URL of the PDF file
 * @param options Optional parameters for loading
 */
export async function loadDocument(
  url: string,
  options?: {
    withCredentials?: boolean;
    cMapUrl?: string;
    cMapPacked?: boolean;
  },
): Promise<PDFDocumentProxy> {
  const params: DocumentInitParameters = {
    url,
    withCredentials: options?.withCredentials ?? false,
  };
  if (options?.cMapUrl) {
    params.cMapUrl = options.cMapUrl;
    params.cMapPacked = options.cMapPacked ?? false;
  }
  return getDocument(params).promise;
}
