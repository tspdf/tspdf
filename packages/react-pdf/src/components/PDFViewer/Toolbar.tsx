import React from 'react';

import { useDocumentMode } from '../../hooks/useDocumentMode';
import { useZoom } from '../../hooks/useZoom';
import { ZoomControls } from '../ZoomControls';

interface ToolbarProps {}

export const Toolbar: React.FC<ToolbarProps> = () => {
  const { mode, setMode } = useDocumentMode();
  const { scale } = useZoom();
  return (
    <div className='flex items-center justify-between border-b bg-white p-4 shadow-sm'>
      <h2 className='text-lg font-semibold'>TSPDF</h2>
      <div className='flex items-center gap-4'>
        <div className='text-sm text-gray-600'>
          <select
            className='rounded border p-1'
            value={mode}
            onChange={e => {
              const value = e.target.value;
              if (value === 'vertical' || value === 'page') {
                setMode(value);
              }
            }}
          >
            <option value='vertical'>Vertical Mode</option>
            <option value='page'>Single Page Mode</option>
          </select>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-600'>
            Scale: {Math.round(scale * 100)}%
          </span>
          <ZoomControls />
        </div>
      </div>
    </div>
  );
};
