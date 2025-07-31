import { Document as CoreDocument, IPage } from '@tspdf/pdf-core';
import React, { useEffect, useState } from 'react';

import { Page } from '../Page';

interface SingleModeBodyProps {
  coreDocument: CoreDocument;
  setError: (error: string | null) => void;
}

export const SingleModeBody: React.FC<SingleModeBodyProps> = ({
  coreDocument,
  setError,
}) => {
  const [currentPage, setCurrentPage] = useState<IPage | null>(null);

  useEffect(() => {
    const initPage = async () => {
      try {
        const page = await coreDocument.getPage(1);
        setCurrentPage(page);
      } catch (err) {
        console.error('Failed to load document:', err);
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    initPage();
  }, [coreDocument, setError]);

  if (!currentPage) {
    return <div className='text-gray-500'>Loading page...</div>;
  }

  return (
    <div className='flex p-4 sm:p-2 md:p-4' style={{ minWidth: '100%' }}>
      <div
        className='mx-auto pr-4 sm:pr-2 md:pr-4'
        style={{ minWidth: 'fit-content' }}
      >
        <Page page={currentPage} />
      </div>
    </div>
  );
};
