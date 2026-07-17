// ─── JSON Storage API Client ─────────────────────────────────
// Shared helper for frontend utilities to read/write JSON data
// from the backend server instead of localStorage.

import { api } from './api';

const AUTH_HEADER = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` }
});

export const jsonStorage = {
  async read<T>(collection: string, defaultData: T): Promise<T> {
    try {
      const res = await api.get(`/json-storage/${collection}`);
      if (res.data && res.data !== null) return res.data;
    } catch (err) {
      console.warn(`[jsonStorage] Failed to read "${collection}", using default.`, err);
    }
    return defaultData;
  },

  async write<T>(collection: string, data: T): Promise<void> {
    await api.put(`/json-storage/${collection}`, data, AUTH_HEADER());
  },

  // Synchronous cache layer — reads from memory cache, 
  // fetches from server in background to keep cache fresh.
  // This is needed because current components use synchronous getData() calls.
  _cache: {} as Record<string, any>,

  readCached<T>(collection: string, defaultData: T): T {
    const cacheKey = `jsonStorage_${collection}`;

    // Always kick off background fetch to keep cache fresh
    this.read(collection, defaultData).then(data => {
      this._cache[cacheKey] = data;
      localStorage.setItem(cacheKey, JSON.stringify(data));
    });

    // Return from memory cache if available
    if (this._cache[cacheKey] !== undefined) return this._cache[cacheKey];

    // Otherwise try localStorage as fallback cache
    const local = localStorage.getItem(cacheKey);
    if (local) {
      try {
        this._cache[cacheKey] = JSON.parse(local);
        return this._cache[cacheKey];
      } catch { /* ignore */ }
    }

    // Return default for first render
    this._cache[cacheKey] = defaultData;
    return defaultData;
  },

  writeCached<T>(collection: string, data: T): void {
    const cacheKey = `jsonStorage_${collection}`;
    this._cache[cacheKey] = data;
    localStorage.setItem(cacheKey, JSON.stringify(data));
    // Write to server in background
    this.write(collection, data).catch(err => {
      console.error(`[jsonStorage] Failed to save "${collection}" to server:`, err);
    });
  },
};
