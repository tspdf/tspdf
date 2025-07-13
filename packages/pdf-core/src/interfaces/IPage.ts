import type {
  IRenderOptions,
  IVisibilityOptions,
  VisibilityCallback,
} from '../types';

/**
 * Interface representing a PDF page with rendering capabilities
 */
export interface IPage {
  readonly pageNumber: number;

  /**
   * Render the page to a canvas
   * @param canvas The canvas element to render to
   * @param options Rendering options
   */
  render(canvas: HTMLCanvasElement, options?: IRenderOptions): Promise<void>;

  /**
   * Destroy the page and free resources
   */
  destroy(): void;

  /**
   * Start observing visibility of the page element
   * @param element The DOM element representing this page
   * @param callback Function to call when visibility changes
   * @param options Options for visibility detection
   */
  observeVisibility(
    element: Element,
    callback: VisibilityCallback,
    options?: IVisibilityOptions,
  ): void;

  /**
   * Stop observing visibility of the page element
   * @param element The DOM element to stop observing
   */
  unobserveVisibility(element: Element): void;

  /**
   * Setup visibility-based rendering. Only renders when the page is visible.
   * @param canvas The canvas element to render to
   * @param element The DOM element to observe for visibility
   * @param options Rendering and visibility options
   */
  setupVisibilityBasedRendering(
    canvas: HTMLCanvasElement,
    element: Element,
    options?: {
      renderOptions?: IRenderOptions;
      visibilityOptions?: IVisibilityOptions;
      onVisibilityChange?: VisibilityCallback;
    },
  ): void;

  /**
   * Update render options for visibility-based rendering (e.g., when scale changes)
   * @param options New render options
   */
  updateRenderOptions(options: IRenderOptions): void;
}
