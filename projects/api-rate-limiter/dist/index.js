"use strict";
/**
 * Main exports for the rate limiter package
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBucketStrategy = exports.SlidingWindowStrategy = exports.FixedWindowStrategy = exports.RedisStore = exports.MemoryStore = exports.rateLimit = exports.RateLimiter = void 0;
__exportStar(require("./types"), exports);
__exportStar(require("./backends/memory-store"), exports);
__exportStar(require("./backends/redis-store"), exports);
__exportStar(require("./strategies"), exports);
__exportStar(require("./middleware/express"), exports);
// Re-export main classes for convenience
var express_1 = require("./middleware/express");
Object.defineProperty(exports, "RateLimiter", { enumerable: true, get: function () { return express_1.RateLimiter; } });
Object.defineProperty(exports, "rateLimit", { enumerable: true, get: function () { return express_1.rateLimit; } });
var memory_store_1 = require("./backends/memory-store");
Object.defineProperty(exports, "MemoryStore", { enumerable: true, get: function () { return memory_store_1.MemoryStore; } });
var redis_store_1 = require("./backends/redis-store");
Object.defineProperty(exports, "RedisStore", { enumerable: true, get: function () { return redis_store_1.RedisStore; } });
var strategies_1 = require("./strategies");
Object.defineProperty(exports, "FixedWindowStrategy", { enumerable: true, get: function () { return strategies_1.FixedWindowStrategy; } });
Object.defineProperty(exports, "SlidingWindowStrategy", { enumerable: true, get: function () { return strategies_1.SlidingWindowStrategy; } });
Object.defineProperty(exports, "TokenBucketStrategy", { enumerable: true, get: function () { return strategies_1.TokenBucketStrategy; } });
//# sourceMappingURL=index.js.map