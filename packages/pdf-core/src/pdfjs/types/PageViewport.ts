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
