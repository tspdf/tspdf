import React, { useEffect, useState } from 'react';

import { useZoom } from '../../hooks/useZoom';

export interface ZoomControlsProps {
  className?: string;
  showPercentage?: boolean;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  className = '',
  showPercentage = true,
}) => {
  const zoomManager = useZoom();
  const [scale, setScale] = useState(1);
  const [canZoomIn, setCanZoomIn] = useState(true);
  const [canZoomOut, setCanZoomOut] = useState(false);

  // Track zoom state changes from the zoom manager
  useEffect(() => {
    const updateZoomState = () => {
      setScale(zoomManager.currentScale);
      setCanZoomIn(zoomManager.canZoomIn);
      setCanZoomOut(zoomManager.canZoomOut);
    };

    // Initial state
    updateZoomState();

    // Listen for zoom changes by polling
    // In a real implementation, you might want to add an event system to the ZoomManager class
    const interval = setInterval(updateZoomState, 100);

    return () => clearInterval(interval);
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
        −
      </button>
      {showPercentage && (
        <button
          onClick={handleReset}
          className='min-w-16 rounded bg-gray-100 px-2 py-1 text-sm font-medium hover:bg-gray-200'
          title='Reset zoom'
        >
          {Math.round(scale * 100)}%
        </button>
      )}
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
