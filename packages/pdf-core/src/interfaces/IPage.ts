import type { IRenderManager } from './IRenderManager';

/**
 * Interface representing a PDF page with rendering capabilities.
 */
export interface IPage {
  readonly pageNumber: number;
  readonly renderManager: IRenderManager;

  /**
   * Initialize the page with a container element.
   */
  init(container: HTMLDivElement, canvas: HTMLCanvasElement): void;

  /**
   * Render the page to a canvas element.
   */
  render(): Promise<void>;

  /**
   * Destroy the page and free resources.
   */
  destroy(): void;
}
