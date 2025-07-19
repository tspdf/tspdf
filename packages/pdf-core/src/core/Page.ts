import type { IPage, IRenderManager, IZoomManager } from '../interfaces';
import { PDFPageProxy } from '../pdfjs/types';
import { RenderManager } from './RenderManager';

export class Page implements IPage {
  public readonly renderManager: IRenderManager;

  constructor(
    private readonly page: PDFPageProxy,
    zoomManager?: IZoomManager,
  ) {
    this.renderManager = new RenderManager(page, zoomManager);
  }

  get pageNumber(): number {
    return this.renderManager.pageNumber;
  }

  init(container: HTMLDivElement): void {
    this.renderManager.init(container);
  }

  async render(canvas: HTMLCanvasElement): Promise<void> {
    return await this.renderManager.render(canvas);
  }

  destroy(): void {
    this.renderManager.destroy();
    this.page.cleanup();
  }
}
