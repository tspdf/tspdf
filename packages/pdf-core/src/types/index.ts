/**
 * PDF viewport information for rendering calculations.
 */
export interface IViewport {
  readonly width: number;
  readonly height: number;
  readonly scale: number;
  readonly rotation: number;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly transform: number[];
}

/**
 * Custom error class for PDF-related operations.
 */
export class PDFError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Callback function for visibility detection events.
 * @param isVisible Whether the element is currently visible
 * @param intersectionRatio How much of the element is visible (0-1)
 */
export type VisibilityCallback = (
  isVisible: boolean,
  intersectionRatio: number,
) => void;

export type { DocumentMode } from './Document';
