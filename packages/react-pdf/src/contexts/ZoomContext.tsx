import { type IZoomManager } from '@tspdf/pdf-core';
import { createContext } from 'react';

export const ZoomContext = createContext<IZoomManager | null>(null);
