import React from 'react';

interface DocumentContainerProps extends React.HTMLProps<HTMLDivElement> {
  file?: string;
}

export const DocumentContainer: React.FC<DocumentContainerProps> = () => {
  return (
    <div className='flex bg-amber-100 font-bold text-red-500'>
      This is a test with style.....
    </div>
  );
};
