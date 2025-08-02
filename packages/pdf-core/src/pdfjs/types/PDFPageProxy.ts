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

import { TextContent, TextContentParameters } from './TextContent';

/**
 * Page viewport type from PDF.js
 * Only includes the properties we actually use
 */
export interface PageViewport {
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
   * Simplified to only include what we use
   */
  render: (options: {
    canvasContext: CanvasRenderingContext2D;
    viewport: PageViewport;
  }) => RenderTask;

  /** Clean up page resources */
  cleanup: () => void;

  /** Get text content from the page */
  getTextContent: (params?: TextContentParameters) => Promise<TextContent>;
}
