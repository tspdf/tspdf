import { Document as CoreDocument, type IPage } from '@tspdf/pdf-core';
import React, { useEffect, useRef, useState } from 'react';

import { useZoomOptional } from '../../hooks/useZoomOptional';
import { Page } from '../Page';

interface DocumentProps extends React.HTMLProps<HTMLDivElement> {
  file: string;
  pageNumber?: number;
}

export const Document: React.FC<DocumentProps> = ({
  file,
  pageNumber = 1,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { zoomManager } = useZoomOptional();
  const [pdfDocument, setPdfDocument] = useState<CoreDocument | null>(null);
  const [currentPage, setCurrentPage] = useState<IPage | null>(null);
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

  // Load page when document or pageNumber changes
  useEffect(() => {
    if (!pdfDocument) return;

    const loadPage = async () => {
      try {
        setError(null);
        const page = await pdfDocument.getPage(pageNumber);
        setCurrentPage(page);
      } catch (err) {
        console.error(`Failed to load page ${pageNumber}:`, err);
        setError(err instanceof Error ? err.message : String(err));
        setCurrentPage(null);
      }
    };

    loadPage();
  }, [pdfDocument, pageNumber]);

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
      <div className='flex p-4 sm:p-2 md:p-4' style={{ minWidth: '100%' }}>
        <div
          className='mx-auto pr-4 sm:pr-2 md:pr-4'
          style={{ minWidth: 'fit-content' }}
        >
          <Page page={currentPage} />
        </div>
      </div>
    </div>
  );
};
