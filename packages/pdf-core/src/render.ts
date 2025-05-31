import type { PDFPageProxy } from "pdfjs-dist";

/**
 * Renders a PDF page onto a canvas element.
 * @param page The PDF page to render
 * @param canvas The HTMLCanvasElement to render into
 * @param options Optional rendering settings
 */
export async function renderPage(
  page: PDFPageProxy,
  canvas: HTMLCanvasElement,
  options?: {
    scale?: number;
    rotate?: number;
    pixelRatio?: number;
  },
): Promise<void> {
  const scale = options?.scale ?? 1;
  const rotate = options?.rotate ?? 0;
  const rotation = rotate === 0 ? page.rotate : page.rotate + rotate;
  const viewport = page.getViewport({ scale, rotation });

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to get canvas 2D context");
  }

  const ratio = options?.pixelRatio ?? window.devicePixelRatio;
  canvas.width = viewport.width * ratio;
  canvas.height = viewport.height * ratio;
  ctx.save();
  ctx.scale(ratio, ratio);

  await page.render({ canvasContext: ctx, viewport }).promise;
  ctx.restore();
}
