/**
 * Main exports for the rate limiter package
 */
export * from './types';
export * from './backends/memory-store';
export * from './backends/redis-store';
export * from './strategies';
export * from './middleware/express';
export { RateLimiter, rateLimit } from './middleware/express';
export { MemoryStore } from './backends/memory-store';
export { RedisStore } from './backends/redis-store';
export { FixedWindowStrategy, SlidingWindowStrategy, TokenBucketStrategy } from './strategies';
//# sourceMappingURL=index.d.ts.map