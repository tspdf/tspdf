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

import { PDFPageProxy } from './PDFPageProxy';

/**
 * PDF document proxy for document-level operations.
 * Only includes what we actually use.
 */
export interface PDFDocumentProxy {
  /** Number of pages in the document */
  numPages: number;
  /** Get a specific page */
  getPage: (pageNumber: number) => Promise<PDFPageProxy>;
  /** Destroy the document and free resources */
  destroy: () => Promise<void>;
}
