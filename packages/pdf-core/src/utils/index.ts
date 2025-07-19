export { EventEmitter } from './EventEmitter';

/**
 * Check if code is running in a browser environment.
 * Used to avoid server-side execution of browser-only APIs.
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}
