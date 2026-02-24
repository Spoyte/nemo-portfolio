/**
 * Rate Limiter - Core Types and Interfaces
 */
export interface RateLimitConfig {
    /** Maximum number of requests allowed in the window */
    maxRequests: number;
    /** Time window in milliseconds */
    windowMs: number;
    /** Allow burst requests (token bucket only) */
    burstCapacity?: number;
    /** Custom key generator function */
    keyGenerator?: (req: any) => string;
    /** Skip rate limiting for certain requests */
    skip?: (req: any) => boolean;
    /** Handler when rate limit is exceeded */
    onLimitExceeded?: (req: any, res: any, info: RateLimitInfo) => void;
    /** Handler for successful requests */
    onSuccess?: (req: any, res: any, info: RateLimitInfo) => void;
}
export interface RateLimitInfo {
    /** Unique identifier for the client */
    key: string;
    /** Maximum allowed requests */
    limit: number;
    /** Remaining requests in current window */
    remaining: number;
    /** Unix timestamp when the window resets */
    resetTime: number;
    /** Total requests made in current window */
    totalRequests: number;
    /** Whether the request was allowed */
    allowed: boolean;
    /** Time until reset in milliseconds */
    retryAfter?: number;
}
export interface BackendConfig {
    /** Backend type */
    type: 'memory' | 'redis';
    /** Redis connection string (required for redis backend) */
    redisUrl?: string;
    /** Key prefix for Redis keys */
    keyPrefix?: string;
    /** Cleanup interval for memory backend (ms) */
    cleanupIntervalMs?: number;
}
export interface ClientRule {
    /** Client identifier (IP, API key, user ID, etc.) */
    clientId: string;
    /** Specific limits for this client */
    limits: Partial<RateLimitConfig>;
    /** Rule priority (higher = more specific) */
    priority?: number;
    /** When this rule expires */
    expiresAt?: Date;
}
export interface StrategyConfig {
    /** Rate limiting strategy */
    strategy: 'fixed-window' | 'sliding-window' | 'token-bucket';
    /** Backend configuration */
    backend: BackendConfig;
    /** Default rate limit config */
    defaultLimits: RateLimitConfig;
    /** Per-client rules */
    clientRules?: ClientRule[];
}
export interface Store {
    /** Increment counter for a key */
    increment(key: string, windowMs: number): Promise<number>;
    /** Decrement counter for a key */
    decrement(key: string): Promise<void>;
    /** Get current count for a key */
    get(key: string): Promise<number>;
    /** Reset counter for a key */
    reset(key: string): Promise<void>;
    /** Get time until window resets */
    getResetTime(key: string, windowMs: number): Promise<number>;
    /** Shutdown the store */
    shutdown(): Promise<void>;
}
export interface TokenBucketState {
    tokens: number;
    lastRefill: number;
}
export interface TokenBucketStore extends Store {
    /** Get token bucket state */
    getBucket(key: string, capacity: number): Promise<TokenBucketState>;
    /** Update token bucket state */
    setBucket(key: string, state: TokenBucketState, ttlMs: number): Promise<void>;
}
//# sourceMappingURL=types.d.ts.map