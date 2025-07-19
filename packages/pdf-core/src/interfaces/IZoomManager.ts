/**
 * Interface for managing zoom functionality in PDF viewers.
 */
export interface IZoomManager {
  /** Current zoom scale (1.0 = 100%) */
  readonly currentScale: number;

  /** Whether zoom can be increased further */
  readonly canZoomIn: boolean;

  /** Whether zoom can be decreased further */
  readonly canZoomOut: boolean;

  /**
   * Set the zoom scale.
   * @param newScale Scale factor (will be clamped to min/max bounds)
   */
  setScale(newScale: number): void;

  /** Zoom in by one step */
  zoomIn(): void;

  /** Zoom out by one step */
  zoomOut(): void;

  /** Reset zoom to 100% (scale = 1.0) */
  resetZoom(): void;

  /**
   * Enable Ctrl+wheel zoom controls on the specified element.
   * @param element Element to attach controls to (defaults to document)
   */
  enableControls(element?: HTMLElement): void;

  /**
   * Disable zoom controls.
   * @param element Element to remove controls from (defaults to document)
   */
  disableControls(element?: HTMLElement): void;

  /**
   * Register a listener for zoom events.
   * @param event - The event name to listen for
   * @param listener - The callback function
   * @returns A function to remove the listener
   */
  on(event: string, listener: (...args: any[]) => void): () => void;

  /**
   * Clean up resources and remove event listeners
   */
  destroy(): void;
}
