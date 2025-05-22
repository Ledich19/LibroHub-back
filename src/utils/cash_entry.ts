type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

export class SimpleCache<T> {
  private cache: CacheEntry<T> | null = null;
  private readonly duration: number;

  constructor(durationMs: number) {
    this.duration = durationMs;
  }

  get(): T | null {
    if (!this.cache) return null;
    const now = Date.now();
    if (now - this.cache.timestamp > this.duration) {
      this.cache = null;
      return null;
    }
    return this.cache.data;
  }

  set(data: T): void {
    this.cache = { data, timestamp: Date.now() };
  }

  clear(): void {
    this.cache = null;
  }
}
