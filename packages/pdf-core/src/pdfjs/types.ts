export interface PDFJS {
  getDocument: typeof import('pdfjs-dist').getDocument;
}

export interface PDFDocumentProxy {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PDFPageProxy>;
  destroy: () => Promise<void>;
}

export interface PDFPageProxy {
  pageNumber: number;
  rotate: number;
  getViewport: (options: any) => any;
  render: (options: any) => { promise: Promise<void> };
  cleanup: () => void;
}
