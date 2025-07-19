import { useContext, useEffect, useState } from 'react';

import { ZoomContext } from '../contexts/ZoomContext';

export const useZoomOptional = () => {
  const context = useContext(ZoomContext);
  const [scale, setScale] = useState(context?.currentScale ?? 1);
  const [canZoomIn, setCanZoomIn] = useState(context?.canZoomIn ?? false);
  const [canZoomOut, setCanZoomOut] = useState(context?.canZoomOut ?? false);

  useEffect(() => {
    if (!context) return;

    const updateState = () => {
      setScale(context.currentScale);
      setCanZoomIn(context.canZoomIn);
      setCanZoomOut(context.canZoomOut);
    };

    const removeListener = context.on('zoomChange', updateState);
    return removeListener;
  }, [context]);

  return {
    scale,
    canZoomIn,
    canZoomOut,
    zoomIn: context ? () => context.zoomIn() : () => {},
    zoomOut: context ? () => context.zoomOut() : () => {},
    resetZoom: context ? () => context.resetZoom() : () => {},
    zoomManager: context,
  };
};
