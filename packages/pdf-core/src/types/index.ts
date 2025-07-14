/**
 * PDF viewport information
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
 * Error types for PDF operations
 */
export enum PDFErrorType {
  LOADING_ERROR = 'LOADING_ERROR',
  PAGE_ERROR = 'PAGE_ERROR',
  RENDERING_ERROR = 'RENDERING_ERROR',
}

/**
 * PDF operation error
 */
export class PDFError extends Error {
  constructor(
    public readonly type: PDFErrorType,
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = 'PDFError';
  }
}

/**
 * Options for rendering a PDF page
 */
export interface IRenderOptions {
  /** Scale factor for rendering */
  scale?: number;
  /** Additional rotation in degrees */
  rotation?: number;
  /** Device pixel ratio for high-DPI displays */
  pixelRatio?: number;
}

/**
 * Visibility detection callback
 */
export type VisibilityCallback = (
  pageNumber: number,
  isVisible: boolean,
  intersectionRatio: number,
) => void;

/**
 * Options for visibility detection
 */
export interface IVisibilityOptions {
  /** Root element for intersection observation (defaults to viewport) */
  root?: Element | null;
  /** Root margin for intersection detection */
  rootMargin?: string;
  /** Threshold for visibility detection (0-1) */
  threshold?: number | number[];
}
