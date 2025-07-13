import type { IVisibilityOptions, VisibilityCallback } from '../types';

/**
 * Simple utility for managing page visibility detection using Intersection Observer
 */
export class VisibilityManager {
  private observer: IntersectionObserver | null = null;
  private callbacks = new Map<Element, VisibilityCallback>();

  constructor(private readonly defaultOptions: IVisibilityOptions = {}) {
    this.createObserver();
  }

  private createObserver(): void {
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      return; // Server-side or unsupported browser
    }

    const options: IntersectionObserverInit = {
      root: this.defaultOptions.root || null,
      rootMargin: this.defaultOptions.rootMargin || '0px',
      threshold: this.defaultOptions.threshold || 0.1,
    };

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const callback = this.callbacks.get(entry.target);
        if (callback) {
          const pageNumber = parseInt(
            entry.target.getAttribute('data-page-number') || '0',
            10,
          );
          callback(pageNumber, entry.isIntersecting, entry.intersectionRatio);
        }
      });
    }, options);
  }

  observe(element: Element, callback: VisibilityCallback): void {
    if (!this.observer) {
      return; // Observer not available
    }

    this.callbacks.set(element, callback);
    this.observer.observe(element);
  }

  unobserve(element: Element): void {
    if (!this.observer) {
      return;
    }

    this.callbacks.delete(element);
    this.observer.unobserve(element);
  }

  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.callbacks.clear();
  }
}
