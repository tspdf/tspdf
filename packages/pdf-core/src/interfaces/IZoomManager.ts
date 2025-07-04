/**
 * Interface for managing zoom functionality
 */
export interface IZoomManager {
  /** Current zoom scale */
  readonly currentScale: number;

  /** Whether the zoom can be increased further */
  readonly canZoomIn: boolean;

  /** Whether the zoom can be decreased further */
  readonly canZoomOut: boolean;

  /**
   * Set the zoom scale
   * @param newScale The new scale factor (will be clamped to min/max bounds)
   */
  setScale(newScale: number): void;

  /** Zoom in by one step */
  zoomIn(): void;

  /** Zoom out by one step */
  zoomOut(): void;

  /** Reset zoom to 100% (scale = 1.0) */
  resetZoom(): void;

  /**
   * Enable Ctrl+wheel zoom controls on the specified element
   * @param element The element to attach zoom controls to (defaults to document)
   */
  enableControls(element?: HTMLElement): void;

  /**
   * Disable zoom controls
   * @param element The element to remove zoom controls from (defaults to document)
   */
  disableControls(element?: HTMLElement): void;

  /** Clean up resources and remove event listeners */
  destroy(): void;

  /**
   * Add a listener for zoom changes
   * @param listener Function to call when zoom changes
   * @returns Function to remove the listener
   */
  addListener(listener: () => void): () => void;
}
