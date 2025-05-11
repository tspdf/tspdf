import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { DocumentCallback } from "react-pdf/dist/esm/shared/types.js";

interface DocumentContainerProps extends React.HTMLProps<HTMLDivElement> {
  file?: string;
}

export const DocumentContainer: React.FC<DocumentContainerProps> = () => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber] = useState<number>(1);

  function onDocumentLoadSuccess(pdf: DocumentCallback): void {
    setNumPages(pdf.numPages);
  }

  return (
    <div>
      <Document
        file="https://raw.githubusercontent.com/tpn/pdfs/master/A%20Course%20in%20Machine%20Learning%20%28ciml-v0_9-all%29.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
};
