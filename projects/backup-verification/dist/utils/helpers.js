"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateChecksum = calculateChecksum;
exports.verifyChecksum = verifyChecksum;
exports.generateId = generateId;
exports.formatBytes = formatBytes;
exports.getNextRunDate = getNextRunDate;
exports.sleep = sleep;
exports.isValidEmail = isValidEmail;
exports.sanitizeFilename = sanitizeFilename;
exports.deepClone = deepClone;
exports.isOlderThan = isOlderThan;
exports.getFileExtension = getFileExtension;
exports.retry = retry;
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = require("fs");
/**
 * Calculate SHA-256 checksum of a file or stream
 */
async function calculateChecksum(source) {
    return new Promise((resolve, reject) => {
        const hash = crypto_1.default.createHash('sha256');
        if (typeof source === 'string') {
            // File path
            const stream = (0, fs_1.createReadStream)(source);
            stream.on('error', reject);
            stream.on('data', (chunk) => hash.update(chunk));
            stream.on('end', () => resolve(hash.digest('hex')));
        }
        else if (Buffer.isBuffer(source)) {
            // Buffer
            hash.update(source);
            resolve(hash.digest('hex'));
        }
        else {
            // Readable stream
            source.on('error', reject);
            source.on('data', (chunk) => hash.update(chunk));
            source.on('end', () => resolve(hash.digest('hex')));
        }
    });
}
/**
 * Verify checksum against expected value
 */
function verifyChecksum(actual, expected) {
    return actual.toLowerCase() === expected.toLowerCase();
}
/**
 * Generate a unique ID
 */
function generateId() {
    return crypto_1.default.randomUUID();
}
/**
 * Format bytes to human readable string
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
/**
 * Parse cron expression and return next run date
 */
function getNextRunDate(cronExpression) {
    try {
        // Basic validation - in production, use a proper cron parser
        const parts = cronExpression.split(' ');
        if (parts.length !== 5) {
            return null;
        }
        // For now, return a date 1 hour from now as placeholder
        // In production, use node-cron or similar to calculate actual next run
        const now = new Date();
        now.setHours(now.getHours() + 1);
        return now;
    }
    catch {
        return null;
    }
}
/**
 * Sleep for specified milliseconds
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Sanitize filename to prevent directory traversal
 */
function sanitizeFilename(filename) {
    return filename
        .replace(/\.\./g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/_{2,}/g, '_');
}
/**
 * Deep clone an object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
 * Check if a date is older than specified days
 */
function isOlderThan(date, days) {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays > days;
}
/**
 * Get file extension
 */
function getFileExtension(filename) {
    const lastDot = filename.lastIndexOf('.');
    return lastDot === -1 ? '' : filename.slice(lastDot + 1).toLowerCase();
}
/**
 * Retry a function with exponential backoff
 */
async function retry(fn, maxRetries = 3, delayMs = 1000) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (i < maxRetries - 1) {
                await sleep(delayMs * Math.pow(2, i));
            }
        }
    }
    throw lastError;
}
//# sourceMappingURL=helpers.js.map