import { type IZoomManager, ZoomManager } from '@tspdf/pdf-core';
import React, {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from 'react';

export const ZoomContext = createContext<IZoomManager | null>(null);

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

export const useZoom = (): IZoomManager => {
  const context = useContext(ZoomContext);
  if (!context) {
    throw new Error('useZoom must be used within a ZoomProvider');
  }
  return context;
};
