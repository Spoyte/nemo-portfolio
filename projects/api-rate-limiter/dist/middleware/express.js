"use strict";
/**
 * Express Middleware for Rate Limiting
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
exports.rateLimit = rateLimit;
const memory_store_1 = require("../backends/memory-store");
const redis_store_1 = require("../backends/redis-store");
const strategies_1 = require("../strategies");
class RateLimiter {
    constructor(config) {
        this.config = config;
        this.clientRules = new Map();
        // Initialize store
        if (config.backend.type === 'redis') {
            this.store = new redis_store_1.RedisStore(config.backend);
        }
        else {
            this.store = new memory_store_1.MemoryStore(config.backend.cleanupIntervalMs);
        }
        // Initialize strategy
        switch (config.strategy) {
            case 'sliding-window':
                this.strategy = new strategies_1.SlidingWindowStrategy(this.store);
                break;
            case 'token-bucket':
                this.strategy = new strategies_1.TokenBucketStrategy(this.store);
                break;
            case 'fixed-window':
            default:
                this.strategy = new strategies_1.FixedWindowStrategy(this.store);
                break;
        }
        // Index client rules
        if (config.clientRules) {
            for (const rule of config.clientRules) {
                this.clientRules.set(rule.clientId, rule);
            }
        }
    }
    /**
     * Create Express middleware
     */
    middleware(options = {}) {
        const standardHeaders = options.standardHeaders !== false;
        const legacyHeaders = options.legacyHeaders === true;
        return async (req, res, next) => {
            try {
                // Get client config (with client rules applied)
                const clientConfig = this.getClientConfig(req);
                // Skip if configured
                if (clientConfig.skip?.(req)) {
                    return next();
                }
                // Generate key
                const key = clientConfig.keyGenerator?.(req) || this.defaultKeyGenerator(req);
                // Check rate limit
                const info = await this.strategy.check(key, clientConfig);
                // Set headers
                if (standardHeaders) {
                    res.setHeader('RateLimit-Limit', info.limit.toString());
                    res.setHeader('RateLimit-Remaining', info.remaining.toString());
                    res.setHeader('RateLimit-Reset', new Date(info.resetTime).toISOString());
                }
                if (legacyHeaders) {
                    res.setHeader('X-RateLimit-Limit', info.limit.toString());
                    res.setHeader('X-RateLimit-Remaining', info.remaining.toString());
                    res.setHeader('X-RateLimit-Reset', Math.ceil(info.resetTime / 1000).toString());
                }
                // Handle result
                if (info.allowed) {
                    // Attach rate limit info to request
                    req.rateLimitInfo = info;
                    clientConfig.onSuccess?.(req, res, info);
                    next();
                }
                else {
                    if (info.retryAfter) {
                        res.setHeader('Retry-After', Math.ceil(info.retryAfter / 1000).toString());
                    }
                    if (clientConfig.onLimitExceeded) {
                        clientConfig.onLimitExceeded(req, res, info);
                    }
                    else {
                        res.status(429).json({
                            error: 'Too Many Requests',
                            message: 'Rate limit exceeded. Please try again later.',
                            retryAfter: info.retryAfter ? Math.ceil(info.retryAfter / 1000) : undefined,
                        });
                    }
                }
            }
            catch (error) {
                // Fail open - allow request if rate limiting fails
                console.error('Rate limiter error:', error);
                next();
            }
        };
    }
    /**
     * Check rate limit manually (for non-Express usage)
     */
    async check(key, customConfig) {
        const config = { ...this.config.defaultLimits, ...customConfig };
        return this.strategy.check(key, config);
    }
    /**
     * Reset rate limit for a key
     */
    async reset(key) {
        await this.store.reset(key);
    }
    /**
     * Add a client rule dynamically
     */
    addClientRule(rule) {
        this.clientRules.set(rule.clientId, rule);
    }
    /**
     * Remove a client rule
     */
    removeClientRule(clientId) {
        this.clientRules.delete(clientId);
    }
    /**
     * Shutdown the rate limiter
     */
    async shutdown() {
        await this.store.shutdown();
    }
    getClientConfig(req) {
        const clientId = this.getClientIdentifier(req);
        const rule = this.clientRules.get(clientId);
        if (rule && (!rule.expiresAt || rule.expiresAt > new Date())) {
            return { ...this.config.defaultLimits, ...rule.limits };
        }
        return this.config.defaultLimits;
    }
    getClientIdentifier(req) {
        // Check for API key first, then IP
        const apiKey = req.headers['x-api-key'] || req.query.apiKey;
        if (apiKey)
            return `api:${apiKey}`;
        return `ip:${this.getClientIp(req)}`;
    }
    defaultKeyGenerator(req) {
        return this.getClientIdentifier(req);
    }
    getClientIp(req) {
        const forwarded = req.headers['x-forwarded-for'];
        if (forwarded) {
            return (typeof forwarded === 'string' ? forwarded : forwarded[0]).split(',')[0].trim();
        }
        return req.socket.remoteAddress || 'unknown';
    }
}
exports.RateLimiter = RateLimiter;
/**
 * Convenience function to create middleware
 */
function rateLimit(config) {
    const limiter = new RateLimiter(config);
    return limiter.middleware(config);
}
//# sourceMappingURL=express.js.map