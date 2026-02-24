"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../index");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Example 1: Basic rate limiting (100 requests per minute)
app.use('/api', (0, index_1.rateLimit)({
    maxRequests: 100,
    windowMs: index_1.windowSizes.minute,
}));
// Example 2: Rate limiting with burst support
app.use('/api/burst', (0, index_1.rateLimit)({
    maxRequests: 10,
    windowMs: index_1.windowSizes.minute,
    burstLimit: 5, // Allow 5 extra requests as burst
}));
// Example 3: Skip certain methods
app.use('/api/webhook', (0, index_1.rateLimit)({
    maxRequests: 100,
    windowMs: index_1.windowSizes.minute,
    skip: (0, index_1.skipMethods)('POST'), // Don't rate limit POST requests (webhooks)
}));
// Example 4: Skip health check routes
app.use((0, index_1.rateLimit)({
    maxRequests: 100,
    windowMs: index_1.windowSizes.minute,
    skip: (0, index_1.skipRoutes)('/health', '/metrics'),
}));
// Example 5: Per-client rate limiting with API keys
const clientRules = [
    { clientId: 'premium-key-1', maxRequests: 10000, windowMs: index_1.windowSizes.hour },
    { clientId: 'premium-key-2', maxRequests: 10000, windowMs: index_1.windowSizes.hour },
    { clientId: 'basic-key-1', maxRequests: 100, windowMs: index_1.windowSizes.hour },
    { clientId: 'basic-key-2', maxRequests: 100, windowMs: index_1.windowSizes.hour },
];
app.use('/api/premium', (0, index_1.rateLimit)({
    clientRules,
    defaultRule: { maxRequests: 10, windowMs: index_1.windowSizes.hour },
    keyGenerator: (0, index_1.apiKeyExtractor)('X-API-Key'),
}));
// Example 6: Using presets
app.use('/api/public', (0, index_1.rateLimit)(index_1.presets.relaxed));
// Example 7: Custom limit handler
app.use('/api/strict', (0, index_1.rateLimit)({
    ...index_1.presets.strict,
    onLimitReached: (req, res, next, retryAfter) => {
        res.status(429).json({
            error: 'Rate limit exceeded',
            message: 'Please upgrade your plan for higher limits',
            upgradeUrl: 'https://example.com/upgrade',
            retryAfter: Math.ceil(retryAfter / 1000),
        });
    },
}));
// Example 8: Using Redis store for distributed rate limiting
// const redisStore = new RedisStore('redis://localhost:6379');
// app.use(rateLimit({
//   maxRequests: 100,
//   windowMs: windowSizes.minute,
//   store: redisStore,
// }));
// Example 9: Reusable rate limiter with shared store
const apiLimiter = (0, index_1.createRateLimiter)({
    store: new index_1.MemoryStore(),
    maxRequests: 100,
    windowMs: index_1.windowSizes.minute,
});
app.use('/api/users', apiLimiter({ maxRequests: 50 }));
app.use('/api/posts', apiLimiter({ maxRequests: 100 }));
app.use('/api/comments', apiLimiter({ maxRequests: 200 }));
// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.get('/api/test', (req, res) => {
    // Access rate limit info
    const rateLimitInfo = req.rateLimit;
    res.json({
        message: 'Success!',
        rateLimit: rateLimitInfo,
    });
});
app.get('/api/users', (req, res) => {
    res.json({ users: [] });
});
app.get('/api/premium/data', (req, res) => {
    res.json({ premiumData: true });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Try these commands:');
    console.log(`  curl http://localhost:${PORT}/health`);
    console.log(`  curl http://localhost:${PORT}/api/test`);
    console.log(`  curl -H "X-API-Key: premium-key-1" http://localhost:${PORT}/api/premium/data`);
});
//# sourceMappingURL=express-example.js.map