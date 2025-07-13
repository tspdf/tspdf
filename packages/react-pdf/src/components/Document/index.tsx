import { Document as CoreDocument, type IPage } from '@tspdf/pdf-core';
import React, { useEffect, useRef, useState } from 'react';

import { useZoomOptional } from '../../hooks/useZoomOptional';
import { Page } from '../Page';

interface DocumentProps extends React.HTMLProps<HTMLDivElement> {
  file: string;
}

export const Document: React.FC<DocumentProps> = ({ file, ...rest }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { zoomManager } = useZoomOptional();
  const [pdfDocument, setPdfDocument] = useState<CoreDocument | null>(null);
  const [pages, setPages] = useState<IPage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load document when file changes
  useEffect(() => {
    if (!file || typeof window === 'undefined') return;

    const loadDocument = async () => {
      try {
        setError(null);
        const doc = new CoreDocument(file, zoomManager || undefined);
        await doc.load();
        setPdfDocument(doc);

        // Load all pages
        const loadedPages: IPage[] = [];
        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i);
          loadedPages.push(page);
        }
        setPages(loadedPages);
      } catch (err) {
        console.error('Failed to load document:', err);
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    loadDocument();
  }, [file, zoomManager]);

  // Enable zoom controls when container and zoomManager are ready
  useEffect(() => {
    if (!zoomManager || !containerRef.current) return;

    const container = containerRef.current;
    zoomManager.enableControls(container);

    return () => {
      zoomManager.disableControls(container);
    };
  }, [zoomManager]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (pdfDocument) {
        pdfDocument.destroy();
      }
    };
  }, [pdfDocument]);

  if (error) {
    return <div className='text-red-500'>Error: {error}</div>;
  }

  return (
    <div
      ref={containerRef}
      className='relative h-full w-full overflow-auto scroll-smooth bg-gray-50'
      {...rest}
    >
      <div
        className='flex flex-col gap-4 p-4 sm:p-2 md:p-4'
        style={{ minWidth: '100%' }}
      >
        {pages.map((page, index) => (
          <div
            key={index}
            className='mx-auto'
            style={{ minWidth: 'fit-content' }}
          >
            <Page page={page} />
          </div>
        ))}
      </div>
    </div>
  );
};
