import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

/**
 * Retrieves a specific page from a loaded PDF document.
 * @param pdf The loaded PDF document
 * @param pageNumber The page number to load (1-based)
 */
export function getPage(
  pdf: PDFDocumentProxy,
  pageNumber: number,
): Promise<PDFPageProxy> {
  return pdf.getPage(pageNumber);
}
