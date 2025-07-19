export class EventEmitter {
  private listeners: Array<() => void> = [];

  addListener(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  protected notifyListeners(): void {
    const currentListeners = [...this.listeners];

    for (const listener of currentListeners) {
      try {
        listener();
      } catch (error) {
        console.error('EventEmitter: Listener error:', error);
      }
    }
  }

  destroy(): void {
    this.listeners.length = 0;
  }
}
