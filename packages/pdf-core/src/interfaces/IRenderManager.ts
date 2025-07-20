import { IViewport, VisibilityCallback } from '../types';

/**
 * Interface for managing PDF page rendering operations.
 */
export interface IRenderManager {
  readonly pageNumber: number;

  /**
   * Current scale factor being applied to the page.
   * Typically derived from the document's zoom level.
   */
  readonly currentScale: number;

  /**
   * Calculates viewport dimensions for rendering the PDF page.
   */
  getViewport(): IViewport;

  /**
   * Initialize the render manager with a container element.
   */
  init(container: HTMLDivElement, canvas: HTMLCanvasElement): void;

  /**
   * Render the page to a canvas element.
   */
  render(): Promise<void>;

  /**
   * Cancel any pending or active render operations.
   */
  cancelRender(): void;

  /**
   * Start observing element visibility for lazy rendering.
   */
  observeVisibility(element: Element, callback: VisibilityCallback): void;

  /**
   * Stop observing element visibility.
   */
  unobserveVisibility(element: Element): void;

  /**
   * Register a listener for render events.
   * @param event - The event name to listen for
   * @param listener - The callback function
   * @returns A function to remove the listener
   */
  on(event: string, listener: (...args: any[]) => void): () => void;

  /**
   * Clean up resources and remove all listeners.
   */
  destroy(): void;
}
