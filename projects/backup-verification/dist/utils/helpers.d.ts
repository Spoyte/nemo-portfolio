import { Readable } from 'stream';
/**
 * Calculate SHA-256 checksum of a file or stream
 */
export declare function calculateChecksum(source: string | Buffer | Readable): Promise<string>;
/**
 * Verify checksum against expected value
 */
export declare function verifyChecksum(actual: string, expected: string): boolean;
/**
 * Generate a unique ID
 */
export declare function generateId(): string;
/**
 * Format bytes to human readable string
 */
export declare function formatBytes(bytes: number, decimals?: number): string;
/**
 * Parse cron expression and return next run date
 */
export declare function getNextRunDate(cronExpression: string): Date | null;
/**
 * Sleep for specified milliseconds
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * Validate email format
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Sanitize filename to prevent directory traversal
 */
export declare function sanitizeFilename(filename: string): string;
/**
 * Deep clone an object
 */
export declare function deepClone<T>(obj: T): T;
/**
 * Check if a date is older than specified days
 */
export declare function isOlderThan(date: Date, days: number): boolean;
/**
 * Get file extension
 */
export declare function getFileExtension(filename: string): string;
/**
 * Retry a function with exponential backoff
 */
export declare function retry<T>(fn: () => Promise<T>, maxRetries?: number, delayMs?: number): Promise<T>;
//# sourceMappingURL=helpers.d.ts.map