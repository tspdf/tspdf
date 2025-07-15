import type { IPage } from '../interfaces';
import { IRenderManager } from '../interfaces/IRenderManager';
import { PDFPageProxy } from '../pdfjs/types';
import type { IRenderOptions } from '../types';
import { RenderManager } from './RenderManager';

export class Page implements IPage {
  public readonly renderManager: IRenderManager;

  constructor(
    private readonly page: PDFPageProxy,
    private readonly getDocumentScale: () => number,
  ) {
    this.renderManager = new RenderManager(page, this.getDocumentScale);
  }

  get pageNumber(): number {
    return this.renderManager.pageNumber;
  }

  async render(
    container: HTMLDivElement,
    canvas: HTMLCanvasElement,
    options: IRenderOptions = {},
  ): Promise<void> {
    this.renderManager.render(container, canvas, options).catch(error => {
      throw error;
    });
  }

  destroy(): void {
    this.renderManager.destroy();
    this.page.cleanup();
  }
}
