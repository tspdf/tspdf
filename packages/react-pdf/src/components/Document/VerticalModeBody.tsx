import { Document as CoreDocument, IPage } from '@tspdf/pdf-core';
import React, { useEffect, useState } from 'react';

import { Page } from '../Page';

interface VerticalModeBodyProps {
  coreDocument: CoreDocument;
  setError: (error: string | null) => void;
}

export const VerticalModeBody: React.FC<VerticalModeBodyProps> = ({
  coreDocument,
  setError,
}) => {
  const [pages, setPages] = useState<IPage[]>([]);

  useEffect(() => {
    if (!coreDocument) return;

    const initPages = async () => {
      try {
        const loadedPages: IPage[] = [];
        const batchSize = 5; // Load 5 pages at a time

        for (let i = 1; i <= coreDocument.numPages; i += batchSize) {
          const batchPromises: Promise<IPage>[] = [];
          const endIndex = Math.min(i + batchSize - 1, coreDocument.numPages);

          for (let j = i; j <= endIndex; j++) {
            batchPromises.push(coreDocument.getPage(j));
          }

          const batchPages = await Promise.all(batchPromises);
          loadedPages.push(...batchPages);

          setPages([...loadedPages]);
        }
      } catch (err) {
        console.error('Failed to load document:', err);
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    initPages();
  }, [coreDocument, setError]);

  return (
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
  );
};
