import { Document } from "../core";
import type { IDocument } from "../interfaces";

/**
 * Create a new PDF document from a URL
 * @param url The URL or path to the PDF file
 * @returns A new PDF document instance
 */
export function createDocument(url: string): IDocument {
  return new Document(url);
}

/**
 * Load a PDF document from a URL
 * @param url The URL or path to the PDF file
 * @returns A promise that resolves to a loaded PDF document
 */
export async function loadDocument(url: string): Promise<IDocument> {
  const document = createDocument(url);
  await document.load();
  return document;
}
