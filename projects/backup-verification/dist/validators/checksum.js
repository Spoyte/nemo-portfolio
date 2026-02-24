"use strict";
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecksumValidator = void 0;
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
const fs_1 = require("fs");
class ChecksumValidator {
    static async calculate(filePath, algorithm = 'sha256') {
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash(algorithm);
            const stream = (0, fs_1.createReadStream)(filePath);
            stream.on('error', reject);
            stream.on('data', (chunk) => hash.update(chunk));
            stream.on('end', () => {
                resolve({
                    algorithm,
                    hash: hash.digest('hex'),
                });
            });
        });
    }
    static async calculateBuffer(buffer, algorithm = 'sha256') {
        const hash = crypto.createHash(algorithm);
        hash.update(buffer);
        return {
            algorithm,
            hash: hash.digest('hex'),
        };
    }
    static async verify(filePath, expectedChecksum, algorithm = 'sha256') {
        const { hash: actual } = await this.calculate(filePath, algorithm);
        return {
            valid: actual.toLowerCase() === expectedChecksum.toLowerCase(),
            actual,
        };
    }
    static async parseChecksumFile(checksumFile) {
        const content = await fs.promises.readFile(checksumFile, 'utf-8');
        const checksums = new Map();
        const lines = content.split('\n').filter(line => line.trim());
        for (const line of lines) {
            // Handle both formats:
            // HASH  filename
            // HASH *filename (binary mode)
            const match = line.match(/^([a-f0-9]+)\s+\*?(.+)$/i);
            if (match) {
                const [, hash, filename] = match;
                checksums.set(filename.trim(), hash.toLowerCase());
            }
        }
        return checksums;
    }
    static async verifyFromChecksumFile(filePath, checksumFile, algorithm = 'sha256') {
        const checksums = await this.parseChecksumFile(checksumFile);
        const basename = filePath.split('/').pop() || filePath;
        const expected = checksums.get(basename);
        if (!expected) {
            throw new Error(`No checksum found for ${basename} in ${checksumFile}`);
        }
        const result = await this.verify(filePath, expected, algorithm);
        return {
            valid: result.valid,
            expected,
            actual: result.actual,
        };
    }
    static detectAlgorithm(checksum) {
        if (checksum.length === 64)
            return 'sha256';
        if (checksum.length === 32)
            return 'md5';
        // Default to sha256 for unknown lengths
        return 'sha256';
    }
}
exports.ChecksumValidator = ChecksumValidator;
//# sourceMappingURL=checksum.js.map