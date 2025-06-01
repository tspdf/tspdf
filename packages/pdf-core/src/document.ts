import type { PDFDocumentProxy } from "pdfjs-dist";
import { getDocument } from "pdfjs-dist";
import type { DocumentInitParameters } from "pdfjs-dist/types/src/display/api";

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
