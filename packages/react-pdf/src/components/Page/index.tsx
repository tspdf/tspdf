import { IPage } from '@tspdf/pdf-core';
import React, { useEffect, useRef } from 'react';

import { useZoomOptional } from '../../hooks/useZoomOptional';

interface PageProps extends React.HTMLProps<HTMLDivElement> {
  page: IPage | null;
}

export const Page: React.FC<PageProps> = ({ page, ...rest }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scale } = useZoomOptional();

  useEffect(() => {
    const renderPage = async () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (page && container && canvas) {
        await page.render(container, canvas, { scale });
      }
    };
    if (typeof window !== 'undefined') {
      renderPage().catch(console.error);
    }
  }, [page, scale]);

  return (
    <div {...rest}>
      <div ref={containerRef}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};
