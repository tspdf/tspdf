import type { IZoomManager } from '../interfaces';
import { EventEmitter } from '../utils';

/**
 * ZoomManager handles zoom operations for PDF documents.
 *
 * Events emitted:
 * - 'zoomUpdate': (newScale: number, oldScale: number) => void
 *   Emitted immediately on every scale change (for real-time dimension updates)
 * - 'zoomChanged': (newScale: number, oldScale: number) => void
 *   Emitted when the zoom scale changes (debounced, for re-rendering)
 */
export class ZoomManager extends EventEmitter implements IZoomManager {
  private scale: number;
  private readonly minScale: number;
  private readonly maxScale: number;
  private readonly zoomFactor: number;
  private readonly stepSize: number;
  private boundWheelHandler: ((event: Event) => void) | null = null;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingScale: number | null = null;

  constructor(
    initialScale: number,
    minScale: number = 0.25,
    maxScale: number = 4.0,
    zoomFactor: number = 1.2,
    stepSize: number = 0.1,
  ) {
    super();
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
    const clampedScale = Math.max(
      this.minScale,
      Math.min(this.maxScale, newScale),
    );
    const oldScale = this.currentScale;

    if (clampedScale === this.currentScale) {
      return;
    }

    this.pendingScale = clampedScale;

    // Emit immediate progress event for real-time dimension updates
    this.emit('zoomUpdate', clampedScale, oldScale);

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      if (this.pendingScale !== null && this.scale !== this.pendingScale) {
        const finalOldScale = this.scale;
        this.scale = this.pendingScale;
        this.emit('zoomChanged', this.scale, finalOldScale);
      }
      this.debounceTimer = null;
      this.pendingScale = null;
    }, 200); // 200ms debounce
  }

  zoomIn(): void {
    this.setScale(this.currentScale + this.stepSize);
  }

  zoomOut(): void {
    this.setScale(this.currentScale - this.stepSize);
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
          this.setScale(this.currentScale * this.zoomFactor);
        } else if (wheelEvent.deltaY > 0) {
          this.setScale(this.currentScale / this.zoomFactor);
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
    super.destroy();
  }
}
