import { IRenderOptions, IViewport } from '../types';

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

  /**
   * Render the page to a canvas
   * @param canvas The canvas element to render to
   * @param options Rendering options
   */
  render(canvas: HTMLCanvasElement, options?: IRenderOptions): Promise<void>;
}
