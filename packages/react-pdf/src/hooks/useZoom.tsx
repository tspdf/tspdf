import { type IZoomManager, ZoomManager } from '@tspdf/pdf-core';
import React, {
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ZoomContext } from '../contexts/ZoomContext';

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

  const [scale, setScale] = useState(context.currentScale);
  const [canZoomIn, setCanZoomIn] = useState(context.canZoomIn);
  const [canZoomOut, setCanZoomOut] = useState(context.canZoomOut);

  useEffect(() => {
    const updateState = () => {
      setScale(context.currentScale);
      setCanZoomIn(context.canZoomIn);
      setCanZoomOut(context.canZoomOut);
    };

    const removeListener = context.addListener(updateState);
    return removeListener;
  }, [context]);

  return {
    scale,
    canZoomIn,
    canZoomOut,
    zoomIn: () => context.zoomIn(),
    zoomOut: () => context.zoomOut(),
    resetZoom: () => context.resetZoom(),
    zoomManager: context,
  };
};
