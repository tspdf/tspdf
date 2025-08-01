import type { IPage, IRenderManager, IZoomManager } from '../interfaces';
import { PDFPageProxy } from '../pdfjs/types';
import { RenderManager } from './RenderManager';
import { TextLayer } from './TextLayer';

export class Page implements IPage {
  public readonly renderManager: IRenderManager;
  public readonly textLayer: TextLayer;
  private container: HTMLDivElement | null = null;

  constructor(
    private readonly page: PDFPageProxy,
    zoomManager?: IZoomManager,
  ) {
    this.renderManager = new RenderManager(page, zoomManager);
    this.textLayer = new TextLayer(page);
  }

  get pageNumber(): number {
    return this.renderManager.pageNumber;
  }

  init(container: HTMLDivElement, canvas: HTMLCanvasElement): void {
    this.container = container;
    this.renderManager.init(container, canvas);
  }

  async render(): Promise<void> {
    await this.renderManager.render();
    await this.textLayer.render(this.container!);
  }

  destroy(): void {
    this.renderManager.destroy();
    this.page.cleanup();
  }
}
