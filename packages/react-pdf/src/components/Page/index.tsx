import { IPage } from '@tspdf/pdf-core';
import React, { useEffect, useRef, useState } from 'react';

interface PageProps extends React.HTMLProps<HTMLDivElement> {
  page: IPage;
}

export const Page: React.FC<PageProps> = ({ page, ...rest }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderTrigger, setRenderTrigger] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    page.init(containerRef.current, canvasRef.current);

    const removeZoomChangedListener = page.renderManager.on(
      'zoomChanged',
      () => {
        setRenderTrigger(prev => prev + 1);
      },
    );

    const removeVisibleListener = page.renderManager.on('visible', () =>
      setRenderTrigger(prev => prev + 1),
    );

    return () => {
      removeZoomChangedListener();
      removeVisibleListener();
    };
  }, [page]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderPage = async () => {
      await page.render();
    };

    renderPage();
  }, [renderTrigger, page]);

  useEffect(() => {
    return () => {
      if (page?.renderManager) {
        page.renderManager.cancelRender();
      }
    };
  }, [page]);

  return (
    <div {...rest}>
      <div ref={containerRef}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};
