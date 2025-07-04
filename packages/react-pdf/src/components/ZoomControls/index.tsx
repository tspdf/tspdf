import React, { useEffect, useState } from 'react';

import { useZoom } from '../../hooks/useZoom';

export interface ZoomControlsProps {
  className?: string;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  className = '',
}) => {
  const zoomManager = useZoom();
  const [canZoomIn, setCanZoomIn] = useState(true);
  const [canZoomOut, setCanZoomOut] = useState(false);

  useEffect(() => {
    const updateZoomState = () => {
      setCanZoomIn(zoomManager.canZoomIn);
      setCanZoomOut(zoomManager.canZoomOut);
    };

    updateZoomState();

    // Listen for zoom changes using the event system
    const removeListener = zoomManager.addListener(updateZoomState);

    return removeListener;
  }, [zoomManager]);

  const handleZoomIn = () => {
    zoomManager.zoomIn();
  };

  const handleZoomOut = () => {
    zoomManager.zoomOut();
  };

  const handleReset = () => {
    zoomManager.resetZoom();
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleZoomOut}
        disabled={!canZoomOut}
        className='rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300'
        title='Zoom out'
      >
        -
      </button>
      <button
        onClick={handleReset}
        className='rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600'
        title='Reset zoom to 100%'
      >
        ⟲
      </button>
      <button
        onClick={handleZoomIn}
        disabled={!canZoomIn}
        className='rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300'
        title='Zoom in'
      >
        +
      </button>
    </div>
  );
};
