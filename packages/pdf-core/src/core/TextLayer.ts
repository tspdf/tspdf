import { PDFPageProxy } from '../pdfjs/types';

export class TextLayer {
  private textDivs: HTMLDivElement[] = [];
  private textContent: any = null;

  constructor(private readonly page: PDFPageProxy) {}

  async render(container: HTMLDivElement): Promise<void> {
    if (!this.textContent) {
      this.textContent = await this.page.getTextContent({
        includeMarkedContent: true,
      });
    }

    this.textDivs = this.textContent.items.map((item: any) => {
      const div = document.createElement('div');
      div.textContent = item.str;
      div.style.left = `${item.transform[4]}px`;
      div.style.top = `${item.transform[5]}px`;
      div.style.fontSize = `${item.height}px`;
      div.style.fontFamily = item.fontName;
      return div;
    });

    this.textDivs.forEach(div => container.appendChild(div));
  }
}
