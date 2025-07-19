/**
 * Enhanced EventEmitter that supports both named events and generic listeners.
 *
 * Named events allow for type-safe event handling with specific event names and payloads.
 * Generic listeners are maintained for backwards compatibility.
 */
export class EventEmitter {
  private eventListeners: Map<string, Array<(...args: any[]) => void>> =
    new Map();

  /**
   * Register a listener for a specific named event.
   *
   * @param event - The event name to listen for
   * @param listener - The callback function to execute when the event is emitted
   * @returns A function to remove the listener
   *
   * @example
   * ```typescript
   * const removeListener = emitter.on('visible', (pageNumber) => {
   *   console.log(`Page ${pageNumber} became visible`);
   * });
   *
   * // Later, remove the listener
   * removeListener();
   * ```
   */
  on(event: string, listener: (...args: any[]) => void): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }

    const listeners = this.eventListeners.get(event)!;
    listeners.push(listener);

    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  /**
   * Emit a named event with optional arguments.
   *
   * @param event - The event name to emit
   * @param args - Arguments to pass to the event listeners
   *
   * @example
   * ```typescript
   * emitter.emit('visible', pageNumber);
   * emitter.emit('zoomChange', newScale, oldScale);
   * ```
   */
  emit(event: string, ...args: any[]): void {
    const listeners = this.eventListeners.get(event);
    if (!listeners) {
      return;
    }

    const currentListeners = [...listeners];
    for (const listener of currentListeners) {
      try {
        listener(...args);
      } catch (error) {
        console.error(
          `EventEmitter: Listener error for event '${event}':`,
          error,
        );
      }
    }
  }

  /**
   * Clean up all event listeners and resources.
   */
  destroy(): void {
    this.eventListeners.clear();
  }
}
