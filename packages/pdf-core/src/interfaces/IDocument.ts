import type { IPage } from './IPage';
import type { IZoomManager } from './IZoomManager';

/**
 * Interface representing a PDF document with its metadata and pages
 */
export interface IDocument {
  /** Number of pages in the document */
  readonly numPages: number;

  /** Zoom manager instance (if zoom is enabled) */
  readonly zoomManager: IZoomManager | undefined;

  /** Load the PDF document */
  load(): Promise<void>;

  /**
   * Get a specific page from the document
   * @param pageNumber Page number (1-based)
   */
  getPage(pageNumber: number): Promise<IPage>;

  /**
   * Destroy the document and free resources
   */
  destroy(): void;
}
