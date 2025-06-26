import type { IDocument, IPage } from '../interfaces';
import { loadPdfjs } from '../pdfjs';
import { PDFDocumentProxy } from '../pdfjs/types';
import { PDFError, PDFErrorType } from '../types';
import { Page } from './Page';

export class Document implements IDocument {
  private pdfDocument: PDFDocumentProxy | null;
  private readonly url: string;

  constructor(url: string) {
    this.pdfDocument = null;
    this.url = url;
  }

  get numPages(): number {
    if (!this.pdfDocument) {
      return 0;
    }
    return this.pdfDocument.numPages;
  }

  async load(): Promise<void> {
    try {
      const pdfjs = await loadPdfjs();

      const loadingTask = pdfjs.getDocument({
        url: this.url,
        withCredentials: false,
      });
      this.pdfDocument = await loadingTask.promise;
    } catch (error) {
      throw new PDFError(
        PDFErrorType.LOADING_ERROR,
        `Failed to load PDF document: ${String(error)}`,
        error as Error,
      );
    }
  }

  async getPage(pageNumber: number): Promise<IPage> {
    if (!this.pdfDocument) {
      throw new PDFError(
        PDFErrorType.LOADING_ERROR,
        'PDF document is not loaded',
      );
    }

    // Validate pageNumber is a valid number and within range
    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1 ||
      pageNumber > this.pdfDocument.numPages
    ) {
      throw new PDFError(
        PDFErrorType.PAGE_ERROR,
        `Invalid page number: ${String(pageNumber)}. Must be between 1 and ${String(this.pdfDocument.numPages)}`,
      );
    }

    try {
      const pdfPage = await this.pdfDocument.getPage(pageNumber);
      return new Page(pdfPage);
    } catch (error) {
      throw new PDFError(
        PDFErrorType.PAGE_ERROR,
        `Failed to get page ${String(pageNumber)}: ${String(error)}`,
        error,
      );
    }
  }

  destroy(): void {
    if (!this.pdfDocument) {
      throw new PDFError(
        PDFErrorType.LOADING_ERROR,
        'PDF document is not loaded',
      );
    }
    void this.pdfDocument.destroy();
  }
}
