import type { IPage } from '../interfaces';
import { PDFPageProxy } from '../pdfjs/types';
import type {
  IRenderOptions,
  IViewport,
  IViewportOptions,
  IVisibilityOptions,
  VisibilityCallback,
} from '../types';
import { PDFError, PDFErrorType } from '../types';
import { VisibilityManager } from '../utils';

export class Page implements IPage {
  private visibilityManager?: VisibilityManager;
  private isVisible = false;
  private pendingCanvas: HTMLCanvasElement | null = null;
  private pendingRenderOptions: IRenderOptions | null = null;

  constructor(
    private readonly page: PDFPageProxy,
    private readonly getDocumentScale?: () => number,
  ) {}

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
    const scale = options.scale ?? this.getDocumentScale?.() ?? 1;

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

  async render(
    canvas: HTMLCanvasElement,
    options: IRenderOptions = {},
  ): Promise<void> {
    try {
      const scale = options.scale ?? this.getDocumentScale?.() ?? 1;
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

  /**
   * Setup visibility-based rendering. Only renders when the page is visible.
   * @param canvas The canvas element to render to
   * @param element The DOM element to observe for visibility
   * @param options Rendering and visibility options
   */
  setupVisibilityBasedRendering(
    canvas: HTMLCanvasElement,
    element: Element,
    options: {
      renderOptions?: IRenderOptions;
      visibilityOptions?: IVisibilityOptions;
      onVisibilityChange?: VisibilityCallback;
    } = {},
  ): void {
    this.pendingCanvas = canvas;
    this.pendingRenderOptions = options.renderOptions ?? {};

    const handleVisibilityChange: VisibilityCallback = async (
      pageNumber,
      visible,
      intersectionRatio,
    ) => {
      this.isVisible = visible;

      // Call user's callback if provided
      options.onVisibilityChange?.(pageNumber, visible, intersectionRatio);

      if (this.pendingCanvas) {
        if (visible) {
          // Render when becomes visible
          try {
            await this.render(
              this.pendingCanvas,
              this.pendingRenderOptions ?? {},
            );
          } catch (error) {
            console.error(`Failed to render page ${pageNumber}:`, error);
          }
        } else {
          // Clear canvas when becomes invisible
          const ctx = this.pendingCanvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(
              0,
              0,
              this.pendingCanvas.width,
              this.pendingCanvas.height,
            );
          }
        }
      }
    };

    this.observeVisibility(
      element,
      handleVisibilityChange,
      options.visibilityOptions,
    );
  }

  /**
   * Update render options for visibility-based rendering (e.g., when scale changes)
   * @param options New render options
   */
  updateRenderOptions(options: IRenderOptions): void {
    this.pendingRenderOptions = { ...this.pendingRenderOptions, ...options };

    // Re-render if currently visible
    if (this.isVisible && this.pendingCanvas) {
      this.render(this.pendingCanvas, this.pendingRenderOptions).catch(
        error => {
          console.error(`Failed to re-render page ${this.pageNumber}:`, error);
        },
      );
    }
  }

  destroy(): void {
    this.visibilityManager?.destroy();
    this.page.cleanup();
  }

  observeVisibility(
    element: Element,
    callback: VisibilityCallback,
    options?: IVisibilityOptions,
  ): void {
    if (!this.visibilityManager) {
      this.visibilityManager = new VisibilityManager(options);
    }

    // Ensure the element has the page number as a data attribute
    element.setAttribute('data-page-number', String(this.pageNumber));

    this.visibilityManager.observe(element, callback);
  }

  unobserveVisibility(element: Element): void {
    this.visibilityManager?.unobserve(element);
  }
}
