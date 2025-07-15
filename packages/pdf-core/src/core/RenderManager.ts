import { IRenderManager } from '../interfaces/IRenderManager';
import { PDFPageProxy } from '../pdfjs/types';
import {
  IViewport,
  IVisibilityOptions,
  PDFError,
  VisibilityCallback,
} from '../types';
import { isBrowser } from '../utils';

export class RenderManager implements IRenderManager {
  private observer: IntersectionObserver | null = null;
  private callbacks = new Map<Element, VisibilityCallback>();
  private defaultVisibilityOptions: IVisibilityOptions = {};
  private renderedCanvases = new Map<HTMLCanvasElement, IViewport>();
  private lastScale: number = 1.0;

  constructor(
    private readonly page: PDFPageProxy,
    private readonly getDocumentScale: () => number,
  ) {
    this.page = page;
    this.getDocumentScale = getDocumentScale;
    this.lastScale = this.currentScale;
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
    container: HTMLDivElement,
    canvas: HTMLCanvasElement,
  ): Promise<void> {
    try {
      const viewport = this.getViewport();
      this.setContainerDimensions(container, viewport);

      // Set up visibility observation with canvas rendering
      this.observeVisibility(container, async (_pageNumber, isVisible) => {
        if (isVisible) {
          await this.renderPageToCanvas(canvas, viewport);
          this.renderedCanvases.set(canvas, viewport);
        }
      });

      // Store canvas for potential re-rendering on scale changes
      this.renderedCanvases.set(canvas, viewport);
    } catch (error) {
      throw new PDFError(
        `Failed to set up rendering for page ${String(this.pageNumber)}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  private setContainerDimensions(
    container: HTMLDivElement,
    viewport: IViewport,
  ): void {
    // Set container dimensions to viewport size for precise visibility tracking
    container.style.width = `${viewport.width}px`;
    container.style.height = `${viewport.height}px`;
  }

  private async renderToCanvas(
    canvas: HTMLCanvasElement,
    viewport: IViewport,
  ): Promise<void> {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new PDFError('Unable to get canvas 2D context');
    }

    const pixelRatio =
      typeof window !== 'undefined' ? window.devicePixelRatio : 1;

    // Set canvas dimensions with pixel ratio for crisp rendering
    canvas.width = viewport.width * pixelRatio;
    canvas.height = viewport.height * pixelRatio;

    // Set canvas CSS dimensions to match viewport
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    // Scale the context to account for device pixel ratio
    ctx.save();
    ctx.scale(pixelRatio, pixelRatio);

    // Render the PDF page to the canvas
    await this.page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    ctx.restore();
  }

  private async renderPageToCanvas(
    canvas: HTMLCanvasElement,
    viewport: IViewport,
  ): Promise<void> {
    await this.renderToCanvas(canvas, viewport);
  }

  private createObserver(options?: IVisibilityOptions): void {
    if (!isBrowser() || !window.IntersectionObserver) {
      return; // Server-side or unsupported browser
    }

    const observerOptions: IntersectionObserverInit = {
      root: options?.root || this.defaultVisibilityOptions.root || null,
      rootMargin:
        options?.rootMargin ||
        this.defaultVisibilityOptions.rootMargin ||
        '0px',
      threshold:
        options?.threshold || this.defaultVisibilityOptions.threshold || 0.1,
    };

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const callback = this.callbacks.get(entry.target);
        if (callback) {
          const pageNumber = parseInt(
            entry.target.getAttribute('data-page-number') || '0',
            10,
          );
          callback(pageNumber, entry.isIntersecting, entry.intersectionRatio);
        }
      });
    }, observerOptions);
  }

  observeVisibility(
    element: Element,
    callback: VisibilityCallback,
    options?: IVisibilityOptions,
  ): void {
    if (!this.observer) {
      this.createObserver(options);
    }

    if (!this.observer) {
      return; // Observer not available
    }

    // Ensure the element has the page number as a data attribute
    element.setAttribute('data-page-number', String(this.pageNumber));

    this.callbacks.set(element, callback);
    this.observer.observe(element);
  }

  unobserveVisibility(element: Element): void {
    if (!this.observer) {
      return;
    }

    this.callbacks.delete(element);
    this.observer.unobserve(element);
  }

  /**
   * Refresh all rendered canvases if the scale has changed
   */
  async refreshIfScaleChanged(): Promise<void> {
    const currentScale = this.currentScale;
    if (currentScale !== this.lastScale) {
      this.lastScale = currentScale;
      await this.refreshAllCanvases();
    }
  }

  /**
   * Force refresh all rendered canvases with current scale
   */
  async refreshAllCanvases(): Promise<void> {
    const viewport = this.getViewport();

    for (const [canvas] of this.renderedCanvases) {
      try {
        await this.renderPageToCanvas(canvas, viewport);
        this.renderedCanvases.set(canvas, viewport);
      } catch (error) {
        console.warn(
          `Failed to refresh canvas for page ${this.pageNumber}:`,
          error,
        );
      }
    }
  }

  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.callbacks.clear();
    this.renderedCanvases.clear();
  }
}
