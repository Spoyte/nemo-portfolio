#!/usr/bin/env node
"use strict";
/**
 * CLI for API Rate Limiter
 */
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const index_1 = require("./index");
const program = new commander_1.Command();
program
    .name('rate-limiter')
    .description('CLI for API Rate Limiter management')
    .version('1.0.0');
program
    .command('check')
    .description('Check rate limit for a key')
    .requiredOption('-k, --key <key>', 'Client key to check')
    .option('-s, --strategy <strategy>', 'Rate limiting strategy', 'fixed-window')
    .option('-w, --window <ms>', 'Time window in milliseconds', '60000')
    .option('-m, --max <count>', 'Maximum requests per window', '100')
    .option('-r, --redis <url>', 'Redis URL (uses memory if not provided)')
    .action(async (options) => {
    try {
        const limiter = new index_1.RateLimiter({
            strategy: options.strategy,
            backend: options.redis
                ? { type: 'redis', redisUrl: options.redis }
                : { type: 'memory' },
            defaultLimits: {
                windowMs: parseInt(options.window),
                maxRequests: parseInt(options.max),
            },
        });
        const info = await limiter.check(options.key);
        console.log('\n📊 Rate Limit Status');
        console.log('====================');
        console.log(`Key:           ${info.key}`);
        console.log(`Allowed:       ${info.allowed ? '✅ Yes' : '❌ No'}`);
        console.log(`Limit:         ${info.limit}`);
        console.log(`Remaining:     ${info.remaining}`);
        console.log(`Total Used:    ${info.totalRequests}`);
        console.log(`Reset Time:    ${new Date(info.resetTime).toLocaleString()}`);
        if (info.retryAfter) {
            console.log(`Retry After:   ${Math.ceil(info.retryAfter / 1000)}s`);
        }
        console.log();
        await limiter.shutdown();
        process.exit(info.allowed ? 0 : 1);
    }
    catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
program
    .command('reset')
    .description('Reset rate limit for a key')
    .requiredOption('-k, --key <key>', 'Client key to reset')
    .option('-r, --redis <url>', 'Redis URL (uses memory if not provided)')
    .option('--prefix <prefix>', 'Redis key prefix', 'ratelimit:')
    .action(async (options) => {
    try {
        const limiter = new index_1.RateLimiter({
            strategy: 'fixed-window',
            backend: options.redis
                ? { type: 'redis', redisUrl: options.redis, keyPrefix: options.prefix }
                : { type: 'memory' },
            defaultLimits: { windowMs: 60000, maxRequests: 100 },
        });
        await limiter.reset(options.key);
        console.log(`✅ Rate limit reset for key: ${options.key}`);
        await limiter.shutdown();
        process.exit(0);
    }
    catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
program
    .command('demo')
    .description('Run a demo server with rate limiting')
    .option('-p, --port <port>', 'Port to run on', '3000')
    .option('-s, --strategy <strategy>', 'Rate limiting strategy', 'fixed-window')
    .option('-w, --window <ms>', 'Time window in milliseconds', '60000')
    .option('-m, --max <count>', 'Maximum requests per window', '10')
    .option('-r, --redis <url>', 'Redis URL (uses memory if not provided)')
    .action(async (options) => {
    const express = require('express');
    const app = express();
    const limiter = new index_1.RateLimiter({
        strategy: options.strategy,
        backend: options.redis
            ? { type: 'redis', redisUrl: options.redis }
            : { type: 'memory' },
        defaultLimits: {
            windowMs: parseInt(options.window),
            maxRequests: parseInt(options.max),
        },
    });
    app.use(express.json());
    app.use(limiter.middleware());
    app.get('/', (req, res) => {
        const info = req.rateLimitInfo;
        res.json({
            message: 'Hello! This endpoint is rate limited.',
            rateLimit: {
                limit: info.limit,
                remaining: info.remaining,
                resetTime: new Date(info.resetTime).toISOString(),
            },
        });
    });
    app.get('/health', (req, res) => {
        res.json({ status: 'ok' });
    });
    app.listen(options.port, () => {
        console.log(`\n🚀 Demo server running on http://localhost:${options.port}`);
        console.log(`\nConfiguration:`);
        console.log(`  Strategy: ${options.strategy}`);
        console.log(`  Window:   ${options.window}ms`);
        console.log(`  Max:      ${options.max} requests`);
        console.log(`  Backend:  ${options.redis ? 'Redis' : 'Memory'}`);
        console.log(`\nTry these commands:`);
        console.log(`  curl http://localhost:${options.port}/`);
        console.log(`  for i in {1..15}; do curl -s http://localhost:${options.port}/ | jq .rateLimit.remaining; done`);
        console.log();
    });
});
program.parse();
//# sourceMappingURL=cli.js.map