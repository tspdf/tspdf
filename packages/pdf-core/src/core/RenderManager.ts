import { IRenderManager } from '../interfaces/IRenderManager';
import { PDFPageProxy } from '../pdfjs/types';
import { IRenderOptions, IViewport, PDFError } from '../types';

export class RenderManager implements IRenderManager {
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

  get pageNumber(): number {
    return this.page.pageNumber;
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

  async render(
    canvas: HTMLCanvasElement,
    options: IRenderOptions = {},
  ): Promise<void> {
    try {
      const pixelRatio =
        options.pixelRatio ??
        (typeof window !== 'undefined' ? window.devicePixelRatio : 1);

      const viewport = this.getViewport();

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new PDFError('Unable to get canvas 2D context');
      }

      // Set canvas size
      canvas.width = viewport.width * pixelRatio;
      canvas.height = viewport.height * pixelRatio;

      // Scale the context to account for device pixel ratio
      ctx.save();
      ctx.scale(pixelRatio, pixelRatio);

      await this.page.render({
        canvasContext: ctx,
        viewport,
      }).promise;

      ctx.restore();
    } catch {
      throw new PDFError(`Failed to render page ${String(this.pageNumber)}`);
    }
  }
}
