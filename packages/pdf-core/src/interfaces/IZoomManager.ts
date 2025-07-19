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
   * Add a listener for zoom changes.
   * @param listener Function to call when zoom changes
   * @returns Function to remove the listener
   */
  addListener(listener: () => void): () => void;

  /** Clean up resources and remove event listeners */
  destroy(): void;
}
