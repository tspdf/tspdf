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

import { PageViewport } from './PageViewport';

// Type definitions derived from PDF.js interfaces
// Original source: https://github.com/mozilla/pdf.js

/**
 * Text content types from PDF.js
 */

/** Text item in PDF content */
export interface TextItem {
  /** The text string */
  str: string;
  /** Text direction */
  dir: string;
  /** Transform matrix */
  transform: number[];
  /** Width in device space */
  width: number;
  /** Height in device space */
  height: number;
  /** Font name */
  fontName: string;
  /** Indicating if the text content is followed by a line-break */
  hasEOL: boolean;
}

/** Text marked content in PDF */
export interface TextMarkedContent {
  /** Either 'beginMarkedContent', 'beginMarkedContentProps', or 'endMarkedContent' */
  type: string;
  /** The marked content identifier. Only used for type 'beginMarkedContentProps' */
  id: string;
}

/** Text content from a PDF page */
export interface TextContent {
  /** Array of text items and marked content */
  items: (TextItem | TextMarkedContent)[];
  /** Text styles (we don't use this but it's part of the interface) */
  styles: Record<string, any>;
  /** The document /Lang attribute */
  lang: string | null;
}

/** Parameters for getting text content */
export interface TextContentParameters {
  /** Include marked content (optional) */
  includeMarkedContent?: boolean;
  /** Disable combining text items (optional) */
  disableCombineTextItems?: boolean;
}

export type TextLayerParameters = {
  /**
   * - Text content to
   * render, i.e. the value returned by the page's `streamTextContent` or
   * `getTextContent` method.
   */
  textContentSource: ReadableStream | TextContent;
  /**
   * - The DOM node that will contain the text
   * runs.
   */
  container: HTMLElement;
  /**
   * - The target viewport to properly layout
   * the text runs.
   */
  viewport: PageViewport;
};

export type TextLayer = {
  /** Render the text layer */
  render(): Promise<void>;
};
