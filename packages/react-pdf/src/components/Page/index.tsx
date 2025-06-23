import { IPage } from '@tspdf/pdf-core';
import React, { useEffect, useRef } from 'react';

interface PageProps extends React.HTMLProps<HTMLDivElement> {
  page: IPage | null;
}

export const Page: React.FC<PageProps> = ({ page, ...rest }) => {
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
    <div
      className='tspdf-page relative box-border rounded-lg bg-white shadow-lg'
      {...rest}
    >
      <canvas
        ref={canvasRef}
        className='block max-w-full rounded-lg border border-gray-200'
      />
    </div>
  );
};
