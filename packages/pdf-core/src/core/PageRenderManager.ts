import { IPageRenderManager } from '../interfaces/IPageRenderManager';
import { PDFPageProxy } from '../pdfjs/types';
import { IViewport } from '../types';

export class PageRenderManager implements IPageRenderManager {
  constructor(
    private readonly page: PDFPageProxy,
    private readonly getDocumentScale: () => number,
  ) {
    this.page = page;
    this.getDocumentScale = getDocumentScale;
  }

  get currentScale(): number {
    return this.getDocumentScale() ?? 1.0;
  }

  getViewport(): IViewport {
    const scale = this.currentScale;

    const viewport = this.page.getViewport({
      scale,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      dontFlip: false,
    });

    return {
      width: viewport.width,
      height: viewport.height,
      scale: viewport.scale,
      rotation: viewport.rotation,
      offsetX: viewport.offsetX,
      offsetY: viewport.offsetY,
      transform: viewport.transform,
    };
  }
}
