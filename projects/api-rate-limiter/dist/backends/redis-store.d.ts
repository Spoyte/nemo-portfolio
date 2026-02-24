/**
 * Redis Store Implementation
 * Uses Redis for distributed rate limiting
 */
import { TokenBucketState, TokenBucketStore, BackendConfig } from '../types';
export declare class RedisStore implements TokenBucketStore {
    private redis;
    private keyPrefix;
    private connected;
    constructor(config: BackendConfig);
    increment(key: string, windowMs: number): Promise<number>;
    decrement(key: string): Promise<void>;
    get(key: string): Promise<number>;
    reset(key: string): Promise<void>;
    getResetTime(key: string, windowMs: number): Promise<number>;
    getBucket(key: string, capacity: number): Promise<TokenBucketState>;
    setBucket(key: string, state: TokenBucketState, ttlMs: number): Promise<void>;
    shutdown(): Promise<void>;
    isConnected(): boolean;
    private getFullKey;
}
//# sourceMappingURL=redis-store.d.ts.map