import React from "react";

interface DocumentContainerProps extends React.HTMLProps<HTMLDivElement> {
  file?: string;
}

export const DocumentContainer: React.FC<DocumentContainerProps> = () => {
  return (
    <div className="flex">
      Test
    </div>
  );
};
