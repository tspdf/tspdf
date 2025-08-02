import type { IDocument, IPage, IZoomManager } from '../interfaces';
import { getDocument } from '../pdfjs';
import { PDFDocumentProxy } from '../pdfjs/types';
import { PDFError } from '../types';
import { Page } from './Page';

export class Document implements IDocument {
  private pdfDocument: PDFDocumentProxy | null;
  private readonly url: string;
  private readonly zoomManager?: IZoomManager;

  constructor(url: string, zoomManager?: IZoomManager) {
    this.pdfDocument = null;
    this.url = url;
    this.zoomManager = zoomManager;
  }

  get numPages(): number {
    if (!this.pdfDocument) {
      return 0;
    }
    return this.pdfDocument.numPages;
  }

  async load(): Promise<void> {
    try {
      const document = await getDocument(this.url);
      this.pdfDocument = document;
    } catch (error) {
      throw new PDFError(`Failed to load PDF document: ${String(error)}`);
    }
  }

  async getPage(pageNumber: number): Promise<IPage> {
    if (!this.pdfDocument) {
      throw new PDFError('PDF document is not loaded');
    }

    // Validate pageNumber is a valid number and within range
    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1 ||
      pageNumber > this.pdfDocument.numPages
    ) {
      throw new PDFError(
        `Invalid page number: ${String(pageNumber)}. Must be between 1 and ${String(this.pdfDocument.numPages)}`,
      );
    }

    try {
      const pdfPage = await this.pdfDocument.getPage(pageNumber);
      const page = new Page(pdfPage, this.zoomManager);

      return page;
    } catch (error) {
      throw new PDFError(
        `Failed to get page ${String(pageNumber)}: ${String(error)}`,
      );
    }
  }

  async getAllPages(): Promise<IPage[]> {
    const pages: IPage[] = [];

    for (let i = 1; i <= this.numPages; i++) {
      try {
        pages.push(await this.getPage(i));
      } catch (error) {
        console.error(`Error loading page ${i}:`, error);
      }
    }

    return pages;
  }

  destroy(): void {
    if (!this.pdfDocument) {
      throw new PDFError('PDF document is not loaded');
    }

    // Clean up zoom controls if available
    this.zoomManager?.destroy();

    void this.pdfDocument.destroy();
  }
}
