import { type IZoomManager } from '@tspdf/pdf-core';
import { useContext } from 'react';

import { ZoomContext } from './useZoom';

export const useZoomOptional = (): IZoomManager | null => {
  const context = useContext(ZoomContext);
  return context;
};
