import {
  IRenderOptions,
  IViewport,
  IVisibilityOptions,
  VisibilityCallback,
} from '../types';

/**
 * Interface for managing PDF page rendering operations.
 *
 * The PageRenderManager is responsible for calculating viewports and managing
 * the rendering properties of a PDF page, including scale, rotation, and positioning.
 */
export interface IRenderManager {
  readonly pageNumber: number;
  /**
   * Gets the current scale factor being applied to the page.
   *
   * This scale is typically derived from the document's zoom level and is used
   * to calculate the appropriate viewport dimensions for rendering.
   *
   * @returns The current scale factor (1.0 = 100%, 2.0 = 200%, etc.)
   */
  readonly currentScale: number;

  /**
   * Calculates and returns a viewport for rendering the PDF page.
   */
  getViewport(): IViewport;

  init(container: HTMLDivElement): void;

  /**
   * Render the page to a canvas
   * @param container The container element for the page
   * @param canvas The canvas element to render to
   * @param options Rendering options
   */
  render(canvas: HTMLCanvasElement, options?: IRenderOptions): Promise<void>;

  /**
   * Observe page container visibility
   * @param element Element to observe
   * @param callback Callback to invoke on visibility changes
   * @param options Visibility detection options
   */
  observeVisibility(
    element: Element,
    callback: VisibilityCallback,
    options?: IVisibilityOptions,
  ): void;

  /**
   * Stop observing element visibility
   * @param element Element to stop observing
   */
  unobserveVisibility(element: Element): void;

  /**
   * Add a listener for render events
   * @param listener Callback to invoke when page should be rendered
   * @returns Function to remove the listener
   */
  addListener(listener: () => void): () => void;

  /**
   * Clean up resources
   */
  destroy(): void;
}
