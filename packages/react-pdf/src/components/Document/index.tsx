import { Document as CoreDocument } from '@tspdf/pdf-core';
import React, { useEffect, useRef, useState } from 'react';

import { useZoomOptional } from '../../hooks/useZoomOptional';
import { SingleModeBody } from './SingleModeBody';
import { VerticalModeBody } from './VerticalModeBody';

interface DocumentProps extends React.HTMLProps<HTMLDivElement> {
  file: string;
  mode?: 'page' | 'vertical';
}

export const Document: React.FC<DocumentProps> = ({
  file,
  mode = 'page',
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { zoomManager } = useZoomOptional();
  const [coreDocument, setCoreDocument] = useState<CoreDocument | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file || typeof window === 'undefined') return;

    const loadDocument = async () => {
      try {
        setError(null);
        const doc = new CoreDocument(file, zoomManager || undefined);
        await doc.load();
        setCoreDocument(doc);
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
      if (coreDocument) {
        coreDocument.destroy();
      }
    };
  }, [coreDocument]);

  if (error) {
    return <div className='text-red-500'>Error: {error}</div>;
  }

  const renderContent = () => {
    if (!coreDocument) {
      return <div className='text-gray-500'>Loading document...</div>;
    }
    if (mode === 'vertical') {
      return (
        <VerticalModeBody coreDocument={coreDocument} setError={setError} />
      );
    }

    return <SingleModeBody coreDocument={coreDocument} setError={setError} />;
  };

  return (
    <div
      ref={containerRef}
      className='relative h-full w-full overflow-auto scroll-smooth bg-gray-50'
      {...rest}
    >
      {renderContent()}
    </div>
  );
};
