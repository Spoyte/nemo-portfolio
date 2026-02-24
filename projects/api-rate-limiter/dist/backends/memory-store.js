"use strict";
/**
 * In-Memory Store Implementation
 * Uses Map for storage with automatic cleanup
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryStore = void 0;
class MemoryStore {
    constructor(cleanupIntervalMs = 60000) {
        this.cleanupInterval = null;
        this.storage = new Map();
        this.cleanupIntervalMs = cleanupIntervalMs;
        this.startCleanup();
    }
    async increment(key, windowMs) {
        const now = Date.now();
        const resetTime = now + windowMs;
        const entry = this.storage.get(key);
        if (!entry || entry.resetTime <= now) {
            // Window expired or new key
            this.storage.set(key, { count: 1, resetTime });
            return 1;
        }
        entry.count++;
        return entry.count;
    }
    async decrement(key) {
        const entry = this.storage.get(key);
        if (entry && entry.count > 0) {
            entry.count--;
        }
    }
    async get(key) {
        const entry = this.storage.get(key);
        if (!entry || entry.resetTime <= Date.now()) {
            return 0;
        }
        return entry.count;
    }
    async reset(key) {
        this.storage.delete(key);
    }
    async getResetTime(key, windowMs) {
        const entry = this.storage.get(key);
        const now = Date.now();
        if (!entry || entry.resetTime <= now) {
            return now + windowMs;
        }
        return entry.resetTime;
    }
    async getBucket(key, capacity) {
        const entry = this.storage.get(key);
        const now = Date.now();
        if (!entry || !entry.bucket) {
            return { tokens: capacity, lastRefill: now };
        }
        return entry.bucket;
    }
    async setBucket(key, state, ttlMs) {
        const resetTime = Date.now() + ttlMs;
        const entry = this.storage.get(key);
        if (entry) {
            entry.bucket = state;
            entry.resetTime = Math.max(entry.resetTime, resetTime);
        }
        else {
            this.storage.set(key, { count: 0, resetTime, bucket: state });
        }
    }
    async shutdown() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        this.storage.clear();
    }
    startCleanup() {
        this.cleanupInterval = setInterval(() => {
            const now = Date.now();
            for (const [key, entry] of this.storage.entries()) {
                if (entry.resetTime <= now) {
                    this.storage.delete(key);
                }
            }
        }, this.cleanupIntervalMs);
    }
    /** Get storage size (for testing/monitoring) */
    get size() {
        return this.storage.size;
    }
}
exports.MemoryStore = MemoryStore;
//# sourceMappingURL=memory-store.js.map