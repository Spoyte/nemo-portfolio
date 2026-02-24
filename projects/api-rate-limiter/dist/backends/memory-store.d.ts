/**
 * In-Memory Store Implementation
 * Uses Map for storage with automatic cleanup
 */
import { TokenBucketState, TokenBucketStore } from '../types';
export declare class MemoryStore implements TokenBucketStore {
    private storage;
    private cleanupInterval;
    private cleanupIntervalMs;
    constructor(cleanupIntervalMs?: number);
    increment(key: string, windowMs: number): Promise<number>;
    decrement(key: string): Promise<void>;
    get(key: string): Promise<number>;
    reset(key: string): Promise<void>;
    getResetTime(key: string, windowMs: number): Promise<number>;
    getBucket(key: string, capacity: number): Promise<TokenBucketState>;
    setBucket(key: string, state: TokenBucketState, ttlMs: number): Promise<void>;
    shutdown(): Promise<void>;
    private startCleanup;
    /** Get storage size (for testing/monitoring) */
    get size(): number;
}
//# sourceMappingURL=memory-store.d.ts.map