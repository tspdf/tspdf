import { IRenderManager, IZoomManager } from '../interfaces';
import { PageViewport, PDFPageProxy } from '../pdfjs/types';
import { PDFError, VisibilityCallback } from '../types';
import { EventEmitter, isBrowser } from '../utils';

/**
 * RenderManager handles the rendering lifecycle of individual PDF pages.
 *
 * Events emitted:
 * - 'visible': (pageNumber: number) => void
 *   Emitted when a page becomes visible in the viewport
 * - 'zoomChanged': (pageNumber: number, scale: number) => void
 *   Emitted when zoom changes and user stops zooming (for actual re-rendering)
 */
export class RenderManager extends EventEmitter implements IRenderManager {
  private observer: IntersectionObserver | null = null;
  private container: HTMLDivElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private currentRenderTask: any = null;
  private isRendering: boolean = false;
  private isVisible: boolean = false;
  private zoomUpdateListenerRemover: (() => void) | null = null;
  private zoomChangedListenerRemover: (() => void) | null = null;

  constructor(
    private readonly page: PDFPageProxy,
    private readonly zoomManager?: IZoomManager,
  ) {
    super();
  }

  get currentScale(): number {
    return this.zoomManager?.currentScale ?? 1.0;
  }

  get pageNumber(): number {
    return this.page.pageNumber;
  }

  getViewport(): PageViewport {
    const scale = this.currentScale;

    return this.page.getViewport({
      scale,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      dontFlip: false,
    });
  }

  init(container: HTMLDivElement, canvas: HTMLCanvasElement): void {
    if (!container) {
      throw new PDFError('Container element is required for rendering');
    }

    if (!canvas) {
      throw new PDFError('Canvas element is required for rendering');
    }

    this.canvas = canvas;
    this.container = container;
    this.setupStateListeners();

    this.setDimensions();

    this.observeVisibility(container, isIntersecting => {
      const wasVisible = this.isVisible;
      this.isVisible = isIntersecting;

      if (isIntersecting && !wasVisible) {
        // Page became visible
        this.emit('visible', this.pageNumber);
      } else if (!isIntersecting && wasVisible) {
        // Page stopped being visible
        this.emit('hidden', this.pageNumber);
      }
    });
  }

  async render(): Promise<void> {
    if (!this.container) {
      throw new PDFError('RenderManager not initialized with a container');
    }

    this.setDimensions();

    if (!this.isVisible) {
      return;
    }

    if (this.isRendering) {
      return;
    }

    this.isRendering = true;

    try {
      this.cancelRender();

      await this.renderCanvas();
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
    this.cancelRender();

    if (this.currentRenderTask) {
      this.currentRenderTask.cancel();
      this.currentRenderTask = null;
    }

    if (this.zoomUpdateListenerRemover) {
      this.zoomUpdateListenerRemover();
      this.zoomUpdateListenerRemover = null;
    }

    if (this.zoomChangedListenerRemover) {
      this.zoomChangedListenerRemover();
      this.zoomChangedListenerRemover = null;
    }

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    super.destroy();
  }

  private setupStateListeners(): void {
    if (this.zoomManager) {
      this.zoomUpdateListenerRemover = this.zoomManager.on('zoomUpdate', () => {
        // Update dimensions immediately when zoom is changing
        this.setDimensions();
      });

      this.zoomChangedListenerRemover = this.zoomManager.on(
        'zoomChanged',
        () => {
          // Emit event when zoom changes (after user stops zooming)
          this.emit('zoomChanged', this.pageNumber, this.currentScale);
        },
      );
    }
  }

  private setDimensions(): void {
    if (!this.container) {
      throw new PDFError('Container element is not set');
    }

    if (!this.canvas) {
      throw new PDFError('Canvas element is not set');
    }

    const viewport = this.getViewport();

    this.container.style.width = `${viewport.width}px`;
    this.container.style.height = `${viewport.height}px`;

    this.canvas.style.width = `${viewport.width}px`;
    this.canvas.style.height = `${viewport.height}px`;
  }

  private async renderCanvas(): Promise<void> {
    if (!this.canvas) {
      throw new PDFError('Canvas element is not set for rendering');
    }

    const viewport = this.getViewport();

    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new PDFError('Unable to get canvas 2D context');
    }

    const pixelRatio =
      typeof window !== 'undefined' ? window.devicePixelRatio : 1;

    this.canvas.width = viewport.width * pixelRatio;
    this.canvas.height = viewport.height * pixelRatio;

    ctx.save();
    ctx.scale(pixelRatio, pixelRatio);

    try {
      this.currentRenderTask = this.page.render({
        canvasContext: ctx,
        viewport,
      });

      await this.currentRenderTask.promise;

      this.currentRenderTask = null;
    } catch (error) {
      this.currentRenderTask = null;

      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = String(error.message).toLowerCase();
        if (
          errorMessage.includes('rendering cancelled') ||
          errorMessage.includes('cancelled')
        ) {
          return;
        }
      }

      throw error;
    } finally {
      ctx.restore();
    }
  }

  private createObserver(callback: VisibilityCallback): void {
    if (!isBrowser() || !window.IntersectionObserver) {
      return;
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
}
