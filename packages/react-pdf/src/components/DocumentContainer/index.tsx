import React from "react";

interface DocumentContainerProps extends React.HTMLProps<HTMLDivElement> {
  file?: string;
}

export const DocumentContainer: React.FC<DocumentContainerProps> = () => {
  return (
    <div className="flex font-bold text-red-500 bg-amber-100">
      This is a test with style.....
    </div>
  );
};
