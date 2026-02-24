"use strict";
/**
 * Redis Store Implementation
 * Uses Redis for distributed rate limiting
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisStore = void 0;
// Dynamic import to avoid requiring redis as a hard dependency
let Redis;
try {
    Redis = require('ioredis');
}
catch {
    // Redis is optional
}
class RedisStore {
    constructor(config) {
        this.connected = false;
        if (!Redis) {
            throw new Error('ioredis is required for Redis backend. Install with: npm install ioredis');
        }
        this.keyPrefix = config.keyPrefix || 'ratelimit:';
        this.redis = new Redis(config.redisUrl || 'redis://localhost:6379');
        this.redis.on('connect', () => {
            this.connected = true;
        });
        this.redis.on('error', (err) => {
            console.error('Redis connection error:', err.message);
            this.connected = false;
        });
    }
    async increment(key, windowMs) {
        const fullKey = this.getFullKey(key);
        const now = Date.now();
        const windowSec = Math.ceil(windowMs / 1000);
        // Use Redis INCR with EXPIRE for atomic operation
        const pipeline = this.redis.pipeline();
        pipeline.incr(fullKey);
        pipeline.expire(fullKey, windowSec);
        const results = await pipeline.exec();
        return results[0][1];
    }
    async decrement(key) {
        const fullKey = this.getFullKey(key);
        await this.redis.decr(fullKey);
    }
    async get(key) {
        const fullKey = this.getFullKey(key);
        const value = await this.redis.get(fullKey);
        return value ? parseInt(value, 10) : 0;
    }
    async reset(key) {
        const fullKey = this.getFullKey(key);
        await this.redis.del(fullKey);
    }
    async getResetTime(key, windowMs) {
        const fullKey = this.getFullKey(key);
        const ttl = await this.redis.ttl(fullKey);
        if (ttl < 0) {
            // Key doesn't exist or has no expiry
            return Date.now() + windowMs;
        }
        return Date.now() + (ttl * 1000);
    }
    async getBucket(key, capacity) {
        const fullKey = `${this.getFullKey(key)}:bucket`;
        const data = await this.redis.get(fullKey);
        if (!data) {
            return { tokens: capacity, lastRefill: Date.now() };
        }
        try {
            return JSON.parse(data);
        }
        catch {
            return { tokens: capacity, lastRefill: Date.now() };
        }
    }
    async setBucket(key, state, ttlMs) {
        const fullKey = `${this.getFullKey(key)}:bucket`;
        const ttlSec = Math.ceil(ttlMs / 1000);
        await this.redis.setex(fullKey, ttlSec, JSON.stringify(state));
    }
    async shutdown() {
        if (this.redis) {
            await this.redis.quit();
        }
    }
    isConnected() {
        return this.connected;
    }
    getFullKey(key) {
        return `${this.keyPrefix}${key}`;
    }
}
exports.RedisStore = RedisStore;
//# sourceMappingURL=redis-store.js.map