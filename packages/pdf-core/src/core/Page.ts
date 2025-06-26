import type { IPage } from '../interfaces';
import { PDFPageProxy } from '../pdfjs/types';
import type { IRenderOptions, IViewport, IViewportOptions } from '../types';
import { PDFError, PDFErrorType } from '../types';

export class Page implements IPage {
  constructor(private readonly page: PDFPageProxy) {}

  get pageNumber(): number {
    return this.page.pageNumber;
  }

  get width(): number {
    const viewport = this.page.getViewport({ scale: 1 });
    return viewport.width;
  }

  get height(): number {
    const viewport = this.page.getViewport({ scale: 1 });
    return viewport.height;
  }

  get rotation(): number {
    return this.page.rotate;
  }

  getViewport(options: IViewportOptions = {}): IViewport {
    const viewport = this.page.getViewport({
      scale: options.scale ?? 1,
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

  async render(
    canvas: HTMLCanvasElement,
    options: IRenderOptions = {},
  ): Promise<void> {
    try {
      const scale = options.scale ?? 1;
      const rotation = options.rotation ?? 0;
      const pixelRatio =
        options.pixelRatio ??
        (typeof window !== 'undefined' ? window.devicePixelRatio : 1);

      const viewport = this.page.getViewport({
        scale,
        rotation: this.rotation + rotation,
      });

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new PDFError(
          PDFErrorType.RENDERING_ERROR,
          'Unable to get canvas 2D context',
        );
      }

      // Set canvas size
      canvas.width = viewport.width * pixelRatio;
      canvas.height = viewport.height * pixelRatio;

      // Scale the context to account for device pixel ratio
      ctx.save();
      ctx.scale(pixelRatio, pixelRatio);

      // Render the page
      await this.page.render({
        canvasContext: ctx,
        viewport,
      }).promise;

      ctx.restore();
    } catch (error) {
      throw new PDFError(
        PDFErrorType.RENDERING_ERROR,
        `Failed to render page ${String(this.pageNumber)}`,
        error as Error,
      );
    }
  }

  destroy(): void {
    this.page.cleanup();
  }
}
