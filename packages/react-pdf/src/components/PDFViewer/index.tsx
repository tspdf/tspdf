import React from 'react';

import { useZoom, ZoomProvider } from '../../contexts/ZoomContext';
import { Document } from '../Document';
import { ZoomControls } from '../ZoomControls';

interface PDFViewerProps {
  file: string;
  pageNumber?: number;
  className?: string;
}

const PDFViewerContent: React.FC<PDFViewerProps> = ({
  file,
  pageNumber = 1,
  className = '',
}) => {
  const { scale } = useZoom();

  return (
    <div className={`flex h-full flex-col ${className}`}>
      {/* Toolbar with zoom controls */}
      <div className='flex items-center justify-between border-b bg-white p-4 shadow-sm'>
        <h2 className='text-lg font-semibold'>PDF Viewer</h2>
        <div className='flex items-center gap-4'>
          <span className='text-sm text-gray-600'>
            Page {pageNumber} • Scale: {Math.round(scale * 100)}%
          </span>
          <ZoomControls />
        </div>
      </div>

      {/* PDF Document */}
      <div className='flex-1 overflow-hidden'>
        <Document file={file} pageNumber={pageNumber} />
      </div>
    </div>
  );
};

export const PDFViewer: React.FC<PDFViewerProps> = props => {
  return (
    <ZoomProvider initialScale={1.0} minScale={0.25} maxScale={4.0}>
      <PDFViewerContent {...props} />
    </ZoomProvider>
  );
};
