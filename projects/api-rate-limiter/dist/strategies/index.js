"use strict";
/**
 * Rate Limiting Strategies
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBucketStrategy = exports.SlidingWindowStrategy = exports.FixedWindowStrategy = void 0;
/**
 * Fixed Window Strategy
 * Simple counter that resets after the window expires
 */
class FixedWindowStrategy {
    constructor(store) {
        this.store = store;
    }
    async check(key, config) {
        const count = await this.store.increment(key, config.windowMs);
        const resetTime = await this.store.getResetTime(key, config.windowMs);
        const remaining = Math.max(0, config.maxRequests - count);
        const allowed = count <= config.maxRequests;
        if (!allowed) {
            // Decrement since we didn't actually allow this request
            await this.store.decrement(key);
        }
        return {
            key,
            limit: config.maxRequests,
            remaining,
            resetTime,
            totalRequests: count,
            allowed,
            retryAfter: allowed ? undefined : resetTime - Date.now(),
        };
    }
}
exports.FixedWindowStrategy = FixedWindowStrategy;
/**
 * Sliding Window Strategy
 * More accurate but slightly more expensive
 * Uses current window + weighted previous window
 */
class SlidingWindowStrategy {
    constructor(store) {
        this.store = store;
    }
    async check(key, config) {
        const now = Date.now();
        const windowMs = config.windowMs;
        // Use two keys for sliding window
        const currentWindowKey = `${key}:${Math.floor(now / windowMs)}`;
        const previousWindowKey = `${key}:${Math.floor(now / windowMs) - 1}`;
        // Get counts from both windows
        const [currentCount, previousCount] = await Promise.all([
            this.store.get(currentWindowKey),
            this.store.get(previousWindowKey),
        ]);
        // Calculate time weight for previous window
        const timeIntoWindow = now % windowMs;
        const weight = 1 - (timeIntoWindow / windowMs);
        // Weighted sum
        const estimatedCount = currentCount + (previousCount * weight);
        // Increment current window
        const newCount = await this.store.increment(currentWindowKey, windowMs);
        const resetTime = Math.ceil(now / windowMs) * windowMs;
        const remaining = Math.max(0, config.maxRequests - Math.ceil(estimatedCount));
        const allowed = estimatedCount < config.maxRequests;
        if (!allowed) {
            await this.store.decrement(currentWindowKey);
        }
        return {
            key,
            limit: config.maxRequests,
            remaining,
            resetTime,
            totalRequests: newCount,
            allowed,
            retryAfter: allowed ? undefined : resetTime - now,
        };
    }
}
exports.SlidingWindowStrategy = SlidingWindowStrategy;
/**
 * Token Bucket Strategy
 * Allows burst traffic while maintaining average rate
 */
class TokenBucketStrategy {
    constructor(store) {
        this.store = store;
    }
    async check(key, config) {
        const now = Date.now();
        const capacity = config.burstCapacity || config.maxRequests;
        const refillRate = config.maxRequests / config.windowMs; // tokens per ms
        // Get current bucket state
        let bucket = await this.store.getBucket(key, capacity);
        // Calculate tokens to add based on time passed
        const timePassed = now - bucket.lastRefill;
        const tokensToAdd = timePassed * refillRate;
        // Refill bucket (capped at capacity)
        bucket.tokens = Math.min(capacity, bucket.tokens + tokensToAdd);
        bucket.lastRefill = now;
        // Check if we can consume a token
        const allowed = bucket.tokens >= 1;
        if (allowed) {
            bucket.tokens -= 1;
        }
        // Save bucket state
        await this.store.setBucket(key, bucket, config.windowMs * 2);
        // Calculate reset time (when 1 token will be available)
        const tokensNeeded = allowed ? 0 : 1 - bucket.tokens;
        const msUntilRefill = tokensNeeded / refillRate;
        const resetTime = now + Math.ceil(msUntilRefill);
        return {
            key,
            limit: capacity,
            remaining: Math.floor(bucket.tokens),
            resetTime,
            totalRequests: Math.floor(capacity - bucket.tokens),
            allowed,
            retryAfter: allowed ? undefined : Math.ceil(msUntilRefill),
        };
    }
}
exports.TokenBucketStrategy = TokenBucketStrategy;
//# sourceMappingURL=index.js.map