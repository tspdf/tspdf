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

/**
 * Text content types from PDF.js
 * Only includes the properties we actually use
 */

/** Text item in PDF content */
export interface TextItem {
  /** The text string */
  str: string;
  /** Text direction */
  dir: string;
  /** Transform matrix */
  transform: number[];
  /** Font name */
  fontName: string;
  /** Font size */
  fontSize: number;
}

/** Text content from a PDF page */
export interface TextContent {
  /** Array of text items */
  items: TextItem[];
  /** Text styles (we don't use this but it's part of the interface) */
  styles: Record<string, any>;
}

/** Parameters for getting text content */
export interface TextContentParameters {
  /** Include marked content (optional) */
  includeMarkedContent?: boolean;
  /** Disable combining text items (optional) */
  disableCombineTextItems?: boolean;
}
