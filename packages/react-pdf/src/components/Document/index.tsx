import React from 'react';

interface DocumentProps extends React.HTMLProps<HTMLDivElement> {
  file?: string;
}

export const Document: React.FC<DocumentProps> = () => {
  return (
    <div className='flex bg-amber-100 font-bold text-red-500'>
      This is a test with style.....
    </div>
  );
};
