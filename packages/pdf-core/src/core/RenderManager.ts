import { IRenderManager, IZoomManager } from '../interfaces';
import { PDFPageProxy } from '../pdfjs/types';
import { IViewport, PDFError, VisibilityCallback } from '../types';
import { isBrowser } from '../utils';

export class RenderManager implements IRenderManager {
  private observer: IntersectionObserver | null = null;
  private listeners: Array<() => void> = [];
  private container: HTMLDivElement | null = null;
  private currentRenderTask: any = null;
  private isRendering: boolean = false;
  private isVisible: boolean = false;
  private zoomListenerRemover: (() => void) | null = null;

  constructor(
    private readonly page: PDFPageProxy,
    private readonly zoomManager?: IZoomManager,
  ) {
    this.page = page;
  }

  get currentScale(): number {
    return this.zoomManager?.currentScale ?? 1.0;
  }

  get pageNumber(): number {
    return this.page.pageNumber;
  }

  private setupStateListeners(): void {
    if (this.zoomManager) {
      this.zoomListenerRemover = this.zoomManager.addListener(() => {
        this.notifyListeners();
      });
    }
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

    this.setupStateListeners();

    const viewport = this.getViewport();
    this.setContainerDimensions(container, viewport);
    this.container = container;

    this.observeVisibility(container, isIntersecting => {
      this.isVisible = isIntersecting;
      if (isIntersecting) {
        this.notifyListeners();
      }
    });
  }

  async render(canvas: HTMLCanvasElement): Promise<void> {
    if (!this.container) {
      throw new PDFError('RenderManager not initialized with a container');
    }

    // Don't render if not visible
    if (!this.isVisible) {
      console.log(`Page ${this.pageNumber} not visible, skipping render`);
      return;
    }

    // Don't render if already rendering
    if (this.isRendering) {
      console.log(`Page ${this.pageNumber} already rendering, skipping`);
      return;
    }

    try {
      // Cancel any existing operations
      this.cancelRender();

      const viewport = this.getViewport();
      this.setContainerDimensions(this.container, viewport);
      await this.renderCanvas(canvas, viewport);

      console.log(`Page ${this.pageNumber} rendered successfully`);
    } finally {
      this.isRendering = false;
    }
  }

  cancelRender(): void {
    if (this.currentRenderTask) {
      this.currentRenderTask.cancel();
      this.currentRenderTask = null;
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

  private createObserver(callback: VisibilityCallback): void {
    if (!isBrowser() || !window.IntersectionObserver) {
      return; // Server-side or unsupported browser
    }

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '100px',
      threshold: 0.01,
    };

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (callback) {
          callback(entry.isIntersecting, entry.intersectionRatio);
        }
      });
    }, observerOptions);
  }

  observeVisibility(element: Element, callback: VisibilityCallback): void {
    if (!this.observer) {
      this.createObserver(callback);
    }

    if (!this.observer) {
      return;
    }

    this.observer.observe(element);
  }

  unobserveVisibility(element: Element): void {
    if (!this.observer) {
      return;
    }

    this.observer.unobserve(element);
  }

  destroy(): void {
    // Cancel any ongoing operations
    this.cancelRender();

    // Cancel any ongoing render task
    if (this.currentRenderTask) {
      this.currentRenderTask.cancel();
      this.currentRenderTask = null;
    }

    // Remove zoom listener
    if (this.zoomListenerRemover) {
      this.zoomListenerRemover();
      this.zoomListenerRemover = null;
    }

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
