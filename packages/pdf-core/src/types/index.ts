/**
 * Options for viewport calculation
 */
export interface IViewportOptions {
  /** Scale factor */
  scale?: number;
  /** Rotation in degrees */
  rotation?: number;
  /** Offset X */
  offsetX?: number;
  /** Offset Y */
  offsetY?: number;
  /** Don't flip */
  dontFlip?: boolean;
}

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
  LOADING_ERROR = "LOADING_ERROR",
  PAGE_ERROR = "PAGE_ERROR",
  RENDERING_ERROR = "RENDERING_ERROR",
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
    this.name = "PDFError";
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
