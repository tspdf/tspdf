import React from 'react';

import { useZoom } from '../../hooks/useZoom';

export interface ZoomControlsProps {
  className?: string;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  className = '',
}) => {
  const { canZoomIn, canZoomOut, zoomIn, zoomOut, resetZoom } = useZoom();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={zoomOut}
        disabled={!canZoomOut}
        className='w-10 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300'
        title='Zoom out'
      >
        -
      </button>
      <button
        onClick={resetZoom}
        className='w-10 rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600'
        title='Reset zoom to 100%'
      >
        ⟲
      </button>
      <button
        onClick={zoomIn}
        disabled={!canZoomIn}
        className='w-10 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300'
        title='Zoom in'
      >
        +
      </button>
    </div>
  );
};
