import { IPageRenderManager } from '../interfaces/IPageRenderManager';
import { PDFPageProxy } from '../pdfjs/types';
import { IViewport, IViewportOptions } from '../types';

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

  getViewport(options: IViewportOptions = {}): IViewport {
    const scale = this.currentScale;

    const viewport = this.page.getViewport({
      scale,
      rotation: options.rotation ?? 0,
      offsetX: options.offsetX ?? 0,
      offsetY: options.offsetY ?? 0,
      dontFlip: options.dontFlip ?? false,
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
