import { type IZoomManager, ZoomManager } from '@tspdf/pdf-core';
import React, { type ReactNode, useContext, useMemo } from 'react';

import { ZoomContext } from '../contexts/ZoomContext';
import { useZoomOptional } from './useZoomOptional';

export interface ZoomProviderProps {
  children: ReactNode;
  zoomManager?: IZoomManager;
  initialScale?: number;
  minScale?: number;
  maxScale?: number;
  zoomFactor?: number;
  stepSize?: number;
}

export const ZoomProvider: React.FC<ZoomProviderProps> = ({
  children,
  zoomManager,
  initialScale = 1.0,
  minScale = 0.25,
  maxScale = 4.0,
  zoomFactor = 1.2,
  stepSize = 0.1,
}) => {
  const contextZoomManager = useMemo(() => {
    return (
      zoomManager ||
      new ZoomManager(initialScale, minScale, maxScale, zoomFactor, stepSize)
    );
  }, [zoomManager, initialScale, minScale, maxScale, zoomFactor, stepSize]);

  return (
    <ZoomContext.Provider value={contextZoomManager}>
      {children}
    </ZoomContext.Provider>
  );
};

export const useZoom = () => {
  const context = useContext(ZoomContext);
  if (!context) {
    throw new Error('useZoom must be used within a ZoomProvider');
  }

  return useZoomOptional();
};
