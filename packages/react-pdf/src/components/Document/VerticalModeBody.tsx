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
  const [corePages, setCorePages] = useState<IPage[]>([]);

  useEffect(() => {
    if (!coreDocument) return;

    const initPages = async () => {
      try {
        const loadedPages = await coreDocument.getAllPages();
        setCorePages(loadedPages);
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
      {corePages.map((page, index) => (
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
