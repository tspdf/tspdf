import type { IZoomManager } from '../interfaces';

export class ZoomManager implements IZoomManager {
  private scale: number;
  private readonly minScale: number;
  private readonly maxScale: number;
  private readonly zoomFactor: number;
  private readonly stepSize: number;
  private boundWheelHandler: ((event: Event) => void) | null = null;

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
    return this.scale;
  }

  get canZoomIn(): boolean {
    return this.scale < this.maxScale;
  }

  get canZoomOut(): boolean {
    return this.scale > this.minScale;
  }

  setScale(newScale: number): void {
    const clampedScale = Math.min(
      Math.max(newScale, this.minScale),
      this.maxScale,
    );
    this.scale = clampedScale;
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
    targetElement.removeEventListener('wheel', this.boundWheelHandler);
    this.boundWheelHandler = null;
  }

  destroy(): void {
    this.disableControls();
  }
}
