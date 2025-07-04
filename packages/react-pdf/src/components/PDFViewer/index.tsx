import React, { useEffect, useState } from 'react';

import { useZoom, ZoomProvider } from '../../hooks/useZoom';
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
  const zoomManager = useZoom();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleZoomChange = () => {
      setScale(zoomManager.currentScale);
    };

    handleZoomChange(); // Initialize scale

    const removeListener = zoomManager.addListener(handleZoomChange);
    return removeListener;
  }, [zoomManager]);

  return (
    <div className={`flex h-full flex-col ${className}`}>
      {/* Toolbar with zoom controls */}
      <div className='flex items-center justify-between border-b bg-white p-4 shadow-sm'>
        <h2 className='text-lg font-semibold'>TSPDF</h2>
        <div className='flex items-center gap-4'>
          <span className='text-sm text-gray-600'>
            Page {pageNumber}
            {` • Scale: ${Math.round(scale * 100)}%`}
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

export const PDFViewer: React.FC<PDFViewerProps> = ({ ...props }) => {
  return (
    <ZoomProvider>
      <PDFViewerContent {...props} />
    </ZoomProvider>
  );
};
