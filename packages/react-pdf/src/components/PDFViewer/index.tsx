import React from 'react';

import { DocumentModeProvider } from '../../hooks/useDocumentMode';
import { ZoomProvider } from '../../hooks/useZoom';
import { Document } from '../Document';
import { Toolbar } from './Toolbar';

interface PDFViewerProps {
  file: string;
  className?: string;
}

const PDFViewerContent: React.FC<PDFViewerProps> = ({
  file,
  className = '',
}) => {
  return (
    <div className={`flex h-full flex-col ${className}`}>
      <Toolbar />

      {/* PDF Document */}
      <div className='flex-1 overflow-hidden'>
        <Document file={file} />
      </div>
    </div>
  );
};

export const PDFViewer: React.FC<PDFViewerProps> = ({ ...props }) => {
  return (
    <DocumentModeProvider>
      <ZoomProvider>
        <PDFViewerContent {...props} />
      </ZoomProvider>
    </DocumentModeProvider>
  );
};
