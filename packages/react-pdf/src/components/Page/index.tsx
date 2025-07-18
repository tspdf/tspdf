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
    if (!containerRef.current) return;

    page.init(containerRef.current);

    const removeListener = page.renderManager.addListener(() => {
      console.log(`Page ${page.pageNumber} visibility or state changed`);
      setRenderTrigger(prev => prev + 1);
    });

    return removeListener;
  }, [page]);

  useEffect(() => {
    if (!canvasRef.current) return;

    console.log(
      `Page ${page.pageNumber} render effect: trigger=${renderTrigger}`,
    );

    const renderPage = async () => {
      await page.render(canvasRef.current!);
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
