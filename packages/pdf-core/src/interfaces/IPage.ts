import type { IRenderManager } from './IRenderManager';

/**
 * Interface representing a PDF page with rendering capabilities
 */
export interface IPage {
  readonly pageNumber: number;
  readonly renderManager: IRenderManager;

  init(container: HTMLDivElement): void;

  /**
   * Render the page to a canvas
   * @param container The container element for the page
   * @param canvas The canvas element to render to
   * @param options Rendering options
   */
  render(canvas: HTMLCanvasElement): Promise<void>;

  /**
   * Destroy the page and free resources
   */
  destroy(): void;
}
