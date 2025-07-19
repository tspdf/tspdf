import { IRenderManager, IZoomManager } from '../interfaces';
import { PDFPageProxy } from '../pdfjs/types';
import { IViewport, PDFError, VisibilityCallback } from '../types';
import { EventEmitter, isBrowser } from '../utils';

export class RenderManager extends EventEmitter implements IRenderManager {
  private observer: IntersectionObserver | null = null;
  private container: HTMLDivElement | null = null;
  private currentRenderTask: any = null;
  private isRendering: boolean = false;
  private isVisible: boolean = false;
  private zoomListenerRemover: (() => void) | null = null;

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

    if (!this.isVisible) {
      return;
    }

    if (this.isRendering) {
      return;
    }

    try {
      this.cancelRender();

      const viewport = this.getViewport();
      this.setContainerDimensions(this.container, viewport);
      await this.renderCanvas(canvas, viewport);
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

    if (this.zoomListenerRemover) {
      this.zoomListenerRemover();
      this.zoomListenerRemover = null;
    }

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    super.destroy();
  }

  private setupStateListeners(): void {
    if (this.zoomManager) {
      this.zoomListenerRemover = this.zoomManager.addListener(() => {
        this.notifyListeners();
      });
    }
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

    canvas.width = viewport.width * pixelRatio;
    canvas.height = viewport.height * pixelRatio;

    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

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
