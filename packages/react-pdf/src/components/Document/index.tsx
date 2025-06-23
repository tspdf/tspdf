import { Document as CoreDocument, IPage } from '@tspdf/pdf-core';
import React, { useEffect, useState } from 'react';

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
  const [pdfDocument, setPdfDocument] = useState<CoreDocument | null>(null);
  const [currentPage, setCurrentPage] = useState<IPage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        setError(null);
        const doc = new CoreDocument(file);
        await doc.load();
        setPdfDocument(doc);
      } catch (err) {
        console.error('Failed to load document:', err);
        setError(err instanceof Error ? err.message : String(err));
      }
    };
    if (file && typeof window !== 'undefined') {
      loadDocument().catch(console.error);
    }
  }, [file]);

  useEffect(() => {
    const loadPage = async () => {
      if (pdfDocument) {
        try {
          setError(null);
          const page = await pdfDocument.getPage(pageNumber);
          setCurrentPage(page);
        } catch (err) {
          console.error(`Failed to load page ${pageNumber}:`, err);
          setError(err instanceof Error ? err.message : String(err));
          setCurrentPage(null);
        }
      }
    };
    if (pdfDocument) {
      loadPage().catch(console.error);
    }
  }, [pdfDocument, pageNumber]);

  if (error) {
    return <div className='text-red-500'>Error: {error}</div>;
  }

  if (!file) {
    return <div className='text-gray-500'>No file specified.</div>;
  }

  return (
    <div
      className='relative h-full w-full overflow-auto scroll-smooth bg-gray-50'
      {...rest}
    >
      <div className='flex min-h-full items-center justify-center p-4 sm:p-2 md:p-4'>
        <div className='origin-center-top mx-auto flex min-h-full w-fit min-w-fit flex-col items-center gap-4 transition-transform duration-200 ease-in-out'>
          <Page page={currentPage} />
        </div>
      </div>
    </div>
  );
};
