import { GlobalWorkerOptions, version as pdfjsVersion } from "pdfjs-dist";

// Automatically configure PDF.js worker from CDN for the current version
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.mjs`;
