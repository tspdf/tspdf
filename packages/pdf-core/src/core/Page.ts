import type { IPage } from '../interfaces';
import { IRenderManager } from '../interfaces/IRenderManager';
import { PDFPageProxy } from '../pdfjs/types';
import type {
  IRenderOptions,
  IVisibilityOptions,
  VisibilityCallback,
} from '../types';
import { VisibilityManager } from '../utils';
import { RenderManager } from './RenderManager';

export class Page implements IPage {
  private visibilityManager?: VisibilityManager;
  private isVisible = false;
  private pendingCanvas: HTMLCanvasElement | null = null;
  private pendingRenderOptions: IRenderOptions | null = null;
  private renderManager: IRenderManager;

  constructor(
    private readonly page: PDFPageProxy,
    private readonly getDocumentScale: () => number,
  ) {
    this.renderManager = new RenderManager(page, this.getDocumentScale);
  }

  get pageNumber(): number {
    return this.renderManager.pageNumber;
  }

  async render(
    canvas: HTMLCanvasElement,
    options: IRenderOptions = {},
  ): Promise<void> {
    this.renderManager.render(canvas, options).catch(error => {
      throw error;
    });
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
