import type { IZoomManager } from '../interfaces';

export class ZoomManager implements IZoomManager {
  private scale: number;
  private readonly minScale: number;
  private readonly maxScale: number;
  private readonly zoomFactor: number;
  private readonly stepSize: number;
  private boundWheelHandler: ((event: Event) => void) | null = null;
  private listeners: Array<() => void> = [];
  private debounceTimer: number | null = null;
  private pendingScale: number | null = null;

  constructor(
    initialScale: number,
    minScale: number = 0.25,
    maxScale: number = 4.0,
    zoomFactor: number = 1.2,
    stepSize: number = 0.1,
  ) {
    this.scale = initialScale;
    this.minScale = minScale;
    this.maxScale = maxScale;
    this.zoomFactor = zoomFactor;
    this.stepSize = stepSize;
  }

  get currentScale(): number {
    // Return pending scale if available for immediate UI feedback
    return this.pendingScale ?? this.scale;
  }

  get canZoomIn(): boolean {
    return this.currentScale < this.maxScale;
  }

  get canZoomOut(): boolean {
    return this.currentScale > this.minScale;
  }

  setScale(newScale: number): void {
    const clampedScale = Math.min(
      Math.max(newScale, this.minScale),
      this.maxScale,
    );

    // Store the pending scale and debounce notifications
    this.pendingScale = clampedScale;

    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = window.setTimeout(() => {
      if (this.pendingScale !== null && this.scale !== this.pendingScale) {
        this.scale = this.pendingScale;
        this.notifyListeners();
      }
      this.debounceTimer = null;
      this.pendingScale = null;
    }, 16); // ~60fps debouncing
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

  zoomIn(): void {
    this.setScale(this.scale + this.stepSize);
  }

  zoomOut(): void {
    this.setScale(this.scale - this.stepSize);
  }

  resetZoom(): void {
    this.setScale(1.0);
  }

  enableControls(element?: HTMLElement): void {
    if (typeof window === 'undefined') return;

    const targetElement = element || document;

    this.boundWheelHandler = (event: Event) => {
      const wheelEvent = event as WheelEvent;

      if (wheelEvent.ctrlKey) {
        wheelEvent.preventDefault();
        wheelEvent.stopPropagation();

        if (wheelEvent.deltaY < 0) {
          this.setScale(this.scale * this.zoomFactor);
        } else if (wheelEvent.deltaY > 0) {
          this.setScale(this.scale / this.zoomFactor);
        }
      }
    };

    targetElement.addEventListener('wheel', this.boundWheelHandler, {
      passive: false,
      capture: true,
    });
  }

  disableControls(element?: HTMLElement): void {
    if (typeof window === 'undefined' || !this.boundWheelHandler) return;

    const targetElement = element || document;
    targetElement.removeEventListener('wheel', this.boundWheelHandler, {
      capture: true,
    });
    this.boundWheelHandler = null;
  }

  destroy(): void {
    this.disableControls();
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.pendingScale = null;
  }
}
