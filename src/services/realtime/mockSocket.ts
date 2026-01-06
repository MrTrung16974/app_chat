type Listener<T> = (payload: T) => void;

type Events = {
  typing: { conversationId: string; userId: string };
  online: { userId: string; status: 'online' | 'offline' };
};

class MockSocket {
  private listeners = new Map<keyof Events, Set<Listener<any>>>();
  private intervalId?: NodeJS.Timeout;

  connect() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      this.emit('typing', { conversationId: 'conv_1', userId: 'user_2' });
      this.emit('online', { userId: 'user_2', status: Math.random() > 0.5 ? 'online' : 'offline' });
    }, 5000);
  }

  disconnect() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>) {
    const set = this.listeners.get(event) ?? new Set();
    set.add(listener);
    this.listeners.set(event, set);
    return () => this.off(event, listener);
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>) {
    this.listeners.get(event)?.delete(listener);
  }

  private emit<K extends keyof Events>(event: K, payload: Events[K]) {
    this.listeners.get(event)?.forEach((listener) => listener(payload));
  }
}

export const mockSocket = new MockSocket();
