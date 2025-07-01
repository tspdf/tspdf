import React, { createContext, useCallback, useContext, useState } from 'react';

export interface ZoomContextValue {
  scale: number;
  zoomIn: () => void;
  zoomOut: () => void;
  setScale: (scale: number) => void;
  resetZoom: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

const ZoomContext = createContext<ZoomContextValue | null>(null);

export interface ZoomProviderProps {
  children: React.ReactNode;
  initialScale?: number;
  minScale?: number;
  maxScale?: number;
  scaleStep?: number;
}

export const ZoomProvider: React.FC<ZoomProviderProps> = ({
  children,
  initialScale = 1.0,
  minScale = 0.25,
  maxScale = 4.0,
  scaleStep = 0.25,
}) => {
  const [scale, setScaleState] = useState(initialScale);

  const setScale = useCallback(
    (newScale: number) => {
      const clampedScale = Math.min(Math.max(newScale, minScale), maxScale);
      setScaleState(clampedScale);
    },
    [minScale, maxScale],
  );

  const zoomIn = useCallback(() => {
    setScale(scale + scaleStep);
  }, [scale, scaleStep, setScale]);

  const zoomOut = useCallback(() => {
    setScale(scale - scaleStep);
  }, [scale, scaleStep, setScale]);

  const resetZoom = useCallback(() => {
    setScale(1.0);
  }, [setScale]);

  const canZoomIn = scale < maxScale;
  const canZoomOut = scale > minScale;

  const value: ZoomContextValue = {
    scale,
    zoomIn,
    zoomOut,
    setScale,
    resetZoom,
    canZoomIn,
    canZoomOut,
  };

  return <ZoomContext.Provider value={value}>{children}</ZoomContext.Provider>;
};

export const useZoom = (): ZoomContextValue => {
  const context = useContext(ZoomContext);
  if (!context) {
    throw new Error('useZoom must be used within a ZoomProvider');
  }
  return context;
};
