import React from 'react';

import { useZoom } from '../../contexts/ZoomContext';

export interface ZoomControlsProps {
  className?: string;
  showPercentage?: boolean;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  className = '',
  showPercentage = true,
}) => {
  const { scale, zoomIn, zoomOut, resetZoom, canZoomIn, canZoomOut } =
    useZoom();

  const handleZoomIn = () => {
    zoomIn();
  };

  const handleZoomOut = () => {
    zoomOut();
  };

  const handleReset = () => {
    resetZoom();
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
