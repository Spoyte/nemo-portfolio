/**
 * Rate Limiting Strategies
 */
import { RateLimitConfig, RateLimitInfo, Store, TokenBucketStore } from '../types';
export interface Strategy {
    check(key: string, config: RateLimitConfig): Promise<RateLimitInfo>;
}
/**
 * Fixed Window Strategy
 * Simple counter that resets after the window expires
 */
export declare class FixedWindowStrategy implements Strategy {
    private store;
    constructor(store: Store);
    check(key: string, config: RateLimitConfig): Promise<RateLimitInfo>;
}
/**
 * Sliding Window Strategy
 * More accurate but slightly more expensive
 * Uses current window + weighted previous window
 */
export declare class SlidingWindowStrategy implements Strategy {
    private store;
    constructor(store: Store);
    check(key: string, config: RateLimitConfig): Promise<RateLimitInfo>;
}
/**
 * Token Bucket Strategy
 * Allows burst traffic while maintaining average rate
 */
export declare class TokenBucketStrategy implements Strategy {
    private store;
    constructor(store: TokenBucketStore);
    check(key: string, config: RateLimitConfig): Promise<RateLimitInfo>;
}
//# sourceMappingURL=index.d.ts.map