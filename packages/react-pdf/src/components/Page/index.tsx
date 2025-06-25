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
      className='relative mx-auto block shrink-0 rounded-lg bg-white p-2 shadow-lg sm:p-1'
      {...rest}
    >
      <canvas
        ref={canvasRef}
        className='block h-auto w-auto max-w-full rounded-lg border border-gray-200 object-contain'
      />
    </div>
  );
};
