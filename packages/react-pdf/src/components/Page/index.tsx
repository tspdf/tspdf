import { IPage } from '@tspdf/pdf-core';
import React, { useEffect, useRef, useState } from 'react';

import { useZoomOptional } from '../../hooks/useZoomOptional';

interface PageProps extends React.HTMLProps<HTMLDivElement> {
  page: IPage | null;
}

export const Page: React.FC<PageProps> = ({ page, ...rest }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const renderTimeoutRef = useRef<number | null>(null);
  const renderAbortRef = useRef<AbortController | null>(null);
  const { scale } = useZoomOptional();

  useEffect(() => {
    if (!page || !containerRef.current) return;

    page.init(containerRef.current);

    const removeListener = page.renderManager.addListener(() => {
      setIsVisible(true);
      setShouldRender(true);
    });

    return removeListener;
  }, [page]);

  // Throttle re-render when scale changes to avoid excessive rendering
  useEffect(() => {
    if (!page) return;

    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }

    renderTimeoutRef.current = window.setTimeout(() => {
      setShouldRender(true);
      renderTimeoutRef.current = null;
    }, 50); // 50ms throttle

    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
        renderTimeoutRef.current = null;
      }
      if (renderAbortRef.current) {
        renderAbortRef.current.abort();
        renderAbortRef.current = null;
      }
    };
  }, [scale, page]);

  useEffect(() => {
    if (
      !shouldRender ||
      !page ||
      !canvasRef.current ||
      isRendering ||
      !isVisible
    )
      return;

    const renderPage = async () => {
      // Cancel any previous render operation
      if (renderAbortRef.current) {
        renderAbortRef.current.abort();
      }

      const abortController = new AbortController();
      renderAbortRef.current = abortController;

      try {
        setIsRendering(true);
        console.log(`Rendering page ${page.pageNumber}...`);

        // Check if operation was cancelled before starting
        if (abortController.signal.aborted) return;

        await page.render(canvasRef.current!);

        // Check if operation was cancelled after render
        if (!abortController.signal.aborted) {
          setShouldRender(false);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error(`Failed to render page ${page.pageNumber}:`, error);
          setShouldRender(false);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsRendering(false);
        }
        renderAbortRef.current = null;
      }
    };

    renderPage();
  }, [shouldRender, page, isRendering, isVisible]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
      if (renderAbortRef.current) {
        renderAbortRef.current.abort();
      }
    };
  }, []);

  return (
    <div {...rest}>
      <div ref={containerRef}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};
