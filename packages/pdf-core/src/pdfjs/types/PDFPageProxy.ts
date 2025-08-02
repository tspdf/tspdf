/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Type definitions derived from PDF.js interfaces
// Original source: https://github.com/mozilla/pdf.js

import { TextContent, TextContentParameters } from './TextLayer';

/**
 * Page viewport type from PDF.js
 */
export interface PageViewport {
  /** The xMin, yMin, xMax and yMax coordinates */
  viewBox: number[];
  /** The size of units */
  userUnit: number;
  /** Viewport width */
  width: number;
  /** Viewport height */
  height: number;
  /** Scale factor */
  scale: number;
  /** Rotation in degrees */
  rotation: number;
  /** X offset */
  offsetX: number;
  /** Y offset */
  offsetY: number;
  /** Transform matrix */
  transform: number[];
  /** The original, un-scaled, viewport dimensions */
  readonly rawDims: object;
  /** Clone viewport with optional additional properties */
  clone(params?: {
    scale?: number;
    rotation?: number;
    offsetX?: number;
    offsetY?: number;
    dontFlip?: boolean;
  }): PageViewport;
  /** Convert PDF point to viewport coordinates */
  convertToViewportPoint(x: number, y: number): number[];
  /** Convert PDF rectangle to viewport coordinates */
  convertToViewportRectangle(rect: number[]): number[];
  /** Convert viewport coordinates to PDF location */
  convertToPdfPoint(x: number, y: number): number[];
}

/**
 * Render parameters interface matching PDF.js RenderParameters
 */
export interface RenderParameters {
  /** A 2D context of a DOM Canvas object */
  canvasContext: CanvasRenderingContext2D;
  /** Rendering viewport obtained by calling PDFPageProxy.getViewport */
  viewport: PageViewport;
  /** Rendering intent, can be 'display', 'print', or 'any' */
  intent?: string;
  /** Controls which annotations are rendered onto the canvas */
  annotationMode?: number;
  /** Additional transform, applied just before viewport transform */
  transform?: number[];
  /** Background to use for the canvas */
  background?: string | CanvasGradient | CanvasPattern;
  /** Overwrites background and foreground colors for high contrast mode */
  pageColors?: object;
  /** Promise that resolves with OptionalContentConfig */
  optionalContentConfigPromise?: Promise<any>;
  /** Map annotation ids with canvases used to render them */
  annotationCanvasMap?: Map<string, HTMLCanvasElement>;
  /** Print annotation storage */
  printAnnotationStorage?: any;
  /** Render the page in editing mode */
  isEditing?: boolean;
}

/**
 * Render task type from PDF.js
 * Only includes what we actually use
 */
export interface RenderTask {
  /** Promise that resolves when rendering is complete */
  promise: Promise<void>;
  /** Cancel the render task */
  cancel: () => void;
}

/**
 * PDF page proxy for page-level operations.
 * Only includes the methods and properties we actually use.
 */
export interface PDFPageProxy {
  /** Page number (1-based) */
  pageNumber: number;
  /** Page rotation in degrees */
  rotate: number;

  /**
   * Get viewport dimensions for the page
   * Only includes the parameters we actually use
   */
  getViewport: (options: {
    scale: number;
    rotation?: number;
    offsetX?: number;
    offsetY?: number;
    dontFlip?: boolean;
  }) => PageViewport;

  /**
   * Render the page to a canvas
   */
  render: (params: RenderParameters) => RenderTask;

  /** Get text content from the page */
  getTextContent: (params?: TextContentParameters) => Promise<TextContent>;
}
