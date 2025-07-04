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
  scaleStep?: number;
}

export const ZoomProvider: React.FC<ZoomProviderProps> = ({
  children,
  zoomManager,
  initialScale = 1.0,
  minScale = 0.25,
  maxScale = 4.0,
  scaleStep = 0.25,
}) => {
  const contextZoomManager = useMemo(() => {
    return (
      zoomManager ||
      new ZoomManager(initialScale, minScale, maxScale, scaleStep)
    );
  }, [zoomManager, initialScale, minScale, maxScale, scaleStep]);

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
