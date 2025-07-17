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
  private listeners: Array<() => void> = [];
  private container: HTMLDivElement | null = null;
  private currentRenderTask: any = null;
  private isRendering: boolean = false;

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

  init(container: HTMLDivElement): void {
    if (!container) {
      throw new PDFError('Container element is required for rendering');
    }

    const viewport = this.getViewport();
    this.setContainerDimensions(container, viewport);
    this.container = container;

    this.observeVisibility(container, (pageNumber, isIntersecting) => {
      if (isIntersecting) {
        this.notifyListeners();
      }
    });
  }

  async render(canvas: HTMLCanvasElement): Promise<void> {
    if (!this.container) {
      throw new PDFError('RenderManager not initialized with a container');
    }

    // Prevent concurrent rendering
    if (this.isRendering) {
      return;
    }

    this.isRendering = true;

    try {
      // Cancel any existing render task
      if (this.currentRenderTask) {
        this.currentRenderTask.cancel();
        this.currentRenderTask = null;
      }

      const viewport = this.getViewport();
      this.setContainerDimensions(this.container, viewport);

      // Use requestAnimationFrame for smooth rendering
      await new Promise<void>(resolve => {
        requestAnimationFrame(async () => {
          try {
            await this.renderCanvas(canvas, viewport);
            resolve();
          } catch (_error) {
            resolve(); // Don't throw in RAF callback
          }
        });
      });
    } finally {
      this.isRendering = false;
    }
  }

  addListener(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  private setContainerDimensions(
    container: HTMLDivElement,
    viewport: IViewport,
  ): void {
    container.style.width = `${viewport.width}px`;
    container.style.height = `${viewport.height}px`;
  }

  private async renderCanvas(
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

    try {
      // Create and store the render task
      this.currentRenderTask = this.page.render({
        canvasContext: ctx,
        viewport,
      });

      // Wait for rendering to complete
      await this.currentRenderTask.promise;

      // Clear the task when done
      this.currentRenderTask = null;
    } catch (error) {
      // Clear the task on error
      this.currentRenderTask = null;

      // Check if this is a cancellation error, which is expected
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = String(error.message).toLowerCase();
        if (
          errorMessage.includes('rendering cancelled') ||
          errorMessage.includes('cancelled')
        ) {
          // This is a cancellation, not a real error - just return
          return;
        }
      }

      // Re-throw actual errors
      throw error;
    } finally {
      ctx.restore();
    }
  }

  private createObserver(options?: IVisibilityOptions): void {
    if (!isBrowser() || !window.IntersectionObserver) {
      return; // Server-side or unsupported browser
    }

    const observerOptions: IntersectionObserverInit = {
      root: options?.root || null,
      rootMargin: options?.rootMargin || '0px',
      threshold: options?.threshold || 0.1,
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

  destroy(): void {
    // Cancel any ongoing render task
    if (this.currentRenderTask) {
      this.currentRenderTask.cancel();
      this.currentRenderTask = null;
    }

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.callbacks.clear();
  }
}
