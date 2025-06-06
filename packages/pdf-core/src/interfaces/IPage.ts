import type { IRenderOptions, IViewport, IViewportOptions } from "../types";

/**
 * Interface representing a PDF page with rendering capabilities
 */
export interface IPage {
  readonly pageNumber: number;
  readonly width: number;
  readonly height: number;
  readonly rotation: number;

  /**
   * Get the viewport for this page with the given parameters
   * @param options Viewport options
   */
  getViewport(options?: IViewportOptions): IViewport;

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
}
