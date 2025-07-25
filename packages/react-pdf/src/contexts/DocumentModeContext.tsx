import { type DocumentMode } from '@tspdf/pdf-core';
import { createContext } from 'react';

export interface DocumentModeContextType {
  mode: DocumentMode;
  setMode: (mode: DocumentMode) => void;
}

export const DocumentModeContext =
  createContext<DocumentModeContextType | null>(null);
