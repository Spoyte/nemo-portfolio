/**
 * Express Middleware for Rate Limiting
 */
import { Request, Response, NextFunction } from 'express';
import { RateLimitConfig, RateLimitInfo, StrategyConfig, ClientRule } from '../types';
export interface RateLimitMiddlewareOptions extends StrategyConfig {
    /** Standard headers to include */
    standardHeaders?: boolean;
    /** Legacy X-RateLimit headers */
    legacyHeaders?: boolean;
}
export declare class RateLimiter {
    private store;
    private strategy;
    private config;
    private clientRules;
    constructor(config: StrategyConfig);
    /**
     * Create Express middleware
     */
    middleware(options?: Partial<RateLimitMiddlewareOptions>): (req: Request, res: Response, next: NextFunction) => void;
    /**
     * Check rate limit manually (for non-Express usage)
     */
    check(key: string, customConfig?: Partial<RateLimitConfig>): Promise<RateLimitInfo>;
    /**
     * Reset rate limit for a key
     */
    reset(key: string): Promise<void>;
    /**
     * Add a client rule dynamically
     */
    addClientRule(rule: ClientRule): void;
    /**
     * Remove a client rule
     */
    removeClientRule(clientId: string): void;
    /**
     * Shutdown the rate limiter
     */
    shutdown(): Promise<void>;
    private getClientConfig;
    private getClientIdentifier;
    private defaultKeyGenerator;
    private getClientIp;
}
/**
 * Convenience function to create middleware
 */
export declare function rateLimit(config: RateLimitMiddlewareOptions): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=express.d.ts.map