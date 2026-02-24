"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
// Basic usage
const basicLimiter = (0, index_1.rateLimit)({
    maxRequests: 100,
    windowMs: index_1.windowSizes.minute,
});
// With burst support
const burstLimiter = (0, index_1.rateLimit)({
    maxRequests: 10,
    windowMs: index_1.windowSizes.minute,
    burstLimit: 5, // 5 extra requests allowed as burst
});
// Using presets
const strictLimiter = (0, index_1.rateLimit)(index_1.presets.strict);
const standardLimiter = (0, index_1.rateLimit)(index_1.presets.standard);
// Custom key generator (by user ID)
const userLimiter = (0, index_1.rateLimit)({
    maxRequests: 100,
    windowMs: index_1.windowSizes.minute,
    keyGenerator: (req) => req.headers['x-user-id'] || req.ip || 'anonymous',
});
// With Redis store
async function createRedisLimiter() {
    const store = new index_1.RedisStore('redis://localhost:6379');
    await store.init();
    return (0, index_1.rateLimit)({
        maxRequests: 100,
        windowMs: index_1.windowSizes.minute,
        store,
    });
}
// Skip certain routes
const skipHealthCheck = (0, index_1.rateLimit)({
    maxRequests: 100,
    windowMs: index_1.windowSizes.minute,
    skip: (req) => req.path === '/health',
});
console.log('Rate limiter examples loaded successfully!');
//# sourceMappingURL=basic-usage.js.map