import { type IPage, type VisibilityCallback } from '@tspdf/pdf-core';
import React, { useCallback, useEffect, useRef } from 'react';

import { useZoomOptional } from '../../hooks/useZoomOptional';

interface PageProps extends React.HTMLProps<HTMLDivElement> {
  page: IPage | null;
}

export const Page: React.FC<PageProps> = ({ page, ...rest }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scale } = useZoomOptional();

  // Visibility detection callback
  const onVisibilityChange: VisibilityCallback = useCallback(
    (pageNumber, visible, intersectionRatio) => {
      if (visible) {
        console.log(
          `📄 Page ${pageNumber} is visible (${Math.round(intersectionRatio * 100)}% visible)`,
        );
      }
    },
    [],
  );

  // Set up visibility-based rendering
  useEffect(() => {
    if (!page || !containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // Setup visibility-based rendering in pdf-core
    page.setupVisibilityBasedRendering(canvas, container, {
      renderOptions: { scale },
      visibilityOptions: {
        threshold: [0.1, 0.5, 0.9], // Trigger at 10%, 50%, and 90% visibility
        rootMargin: '50px', // Start detecting 50px before entering viewport
      },
      onVisibilityChange,
    });

    return () => {
      // Clean up visibility observer
      page.unobserveVisibility(container);
    };
  }, [page, scale, onVisibilityChange]);

  return (
    <div
      ref={containerRef}
      className='relative mx-auto block shrink-0 rounded-lg bg-white p-2 shadow-lg sm:p-1'
      {...rest}
    >
      <canvas
        ref={canvasRef}
        className='block h-auto w-auto rounded-lg border border-gray-200'
      />
    </div>
  );
};
