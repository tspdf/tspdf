import { type DocumentMode } from '@tspdf/pdf-core';
import React, { type ReactNode, useContext, useState } from 'react';

import {
  DocumentModeContext,
  type DocumentModeContextType,
} from '../contexts/DocumentModeContext';

export interface DocumentModeProviderProps {
  children: ReactNode;
  initialMode?: DocumentMode;
}

export const DocumentModeProvider: React.FC<DocumentModeProviderProps> = ({
  children,
  initialMode = 'page',
}) => {
  const [mode, setMode] = useState<DocumentMode>(initialMode);

  const contextValue: DocumentModeContextType = {
    mode,
    setMode,
  };

  return (
    <DocumentModeContext.Provider value={contextValue}>
      {children}
    </DocumentModeContext.Provider>
  );
};

export const useDocumentMode = () => {
  const context = useContext(DocumentModeContext);
  if (!context) {
    throw new Error(
      'useDocumentMode must be used within a DocumentModeProvider',
    );
  }

  return context;
};

export const useDocumentModeOptional = () => {
  const context = useContext(DocumentModeContext);
  return context;
};
