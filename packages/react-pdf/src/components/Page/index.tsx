import { IPage } from '@tspdf/pdf-core';
import React, { useEffect, useRef } from 'react';

interface PageProps extends React.HTMLProps<HTMLDivElement> {
  page: IPage | null;
}

export const Page: React.FC<PageProps> = ({ page }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderPage = async () => {
      if (page && canvasRef.current) {
        await page.render(canvasRef.current);
      }
    };
    if (typeof window !== 'undefined') {
      renderPage().catch(console.error);
    }
  }, [page]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid #000', maxWidth: '100%' }}
      />
    </div>
  );
};
