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
exports.RestoreTester = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const util_1 = require("util");
const child_process_1 = require("child_process");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class RestoreTester {
    tempDir;
    constructor(tempDir = '/tmp/backup-verify') {
        this.tempDir = tempDir;
    }
    async testRestore(config, backupPath) {
        const startTime = Date.now();
        if (!config.testRestore) {
            return {
                success: true,
                attempted: false,
                duration: Date.now() - startTime,
            };
        }
        try {
            // Ensure temp directory exists
            await fs.promises.mkdir(this.tempDir, { recursive: true });
            const restorePath = config.restorePath || path.join(this.tempDir, `restore-${Date.now()}`);
            await fs.promises.mkdir(restorePath, { recursive: true });
            let result;
            switch (config.source.type) {
                case 'file':
                    result = await this.restoreFile(backupPath, restorePath);
                    break;
                case 'database':
                    result = await this.restoreDatabase(config, backupPath);
                    break;
                case 's3':
                case 'gcs':
                case 'azure':
                    result = await this.restoreCloudBackup(backupPath, restorePath);
                    break;
                default:
                    throw new Error(`Unsupported backup type: ${config.source.type}`);
            }
            result.duration = Date.now() - startTime;
            return result;
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error),
                duration: Date.now() - startTime,
            };
        }
    }
    async restoreFile(backupPath, restorePath) {
        const stats = await fs.promises.stat(backupPath);
        if (stats.isDirectory()) {
            // Copy directory recursively
            await this.copyDirectory(backupPath, restorePath);
        }
        else {
            // Handle compressed files
            if (backupPath.endsWith('.tar.gz') || backupPath.endsWith('.tgz')) {
                await execAsync(`tar -xzf "${backupPath}" -C "${restorePath}"`);
            }
            else if (backupPath.endsWith('.tar.bz2')) {
                await execAsync(`tar -xjf "${backupPath}" -C "${restorePath}"`);
            }
            else if (backupPath.endsWith('.tar.xz')) {
                await execAsync(`tar -xJf "${backupPath}" -C "${restorePath}"`);
            }
            else if (backupPath.endsWith('.zip')) {
                await execAsync(`unzip -q "${backupPath}" -d "${restorePath}"`);
            }
            else if (backupPath.endsWith('.gz')) {
                const destFile = path.join(restorePath, path.basename(backupPath, '.gz'));
                await execAsync(`gunzip -c "${backupPath}" > "${destFile}"`);
            }
            else {
                // Regular file - just copy
                const destFile = path.join(restorePath, path.basename(backupPath));
                await fs.promises.copyFile(backupPath, destFile);
            }
        }
        // Verify the restored content is readable
        await this.verifyRestoredContent(restorePath);
        return {
            success: true,
            path: restorePath,
            duration: 0,
        };
    }
    async restoreDatabase(config, backupPath) {
        if (config.source.type !== 'database') {
            throw new Error('Invalid source type for database restore');
        }
        const { dbType, host, port, username, password, database } = config.source;
        // Create test database name
        const testDbName = `${database}_restore_test_${Date.now()}`;
        try {
            if (dbType === 'mysql') {
                // Create test database
                await execAsync(`mysql -h "${host}" -P ${port} -u "${username}" -p"${password}" -e "CREATE DATABASE ${testDbName};"`);
                // Restore backup
                await execAsync(`mysql -h "${host}" -P ${port} -u "${username}" -p"${password}" "${testDbName}" < "${backupPath}"`);
                // Verify tables exist
                const { stdout } = await execAsync(`mysql -h "${host}" -P ${port} -u "${username}" -p"${password}" -e "SHOW TABLES;" "${testDbName}"`);
                if (!stdout.trim()) {
                    throw new Error('No tables found in restored database');
                }
                // Cleanup test database
                await execAsync(`mysql -h "${host}" -P ${port} -u "${username}" -p"${password}" -e "DROP DATABASE ${testDbName};"`);
            }
            else if (dbType === 'postgresql') {
                // Create test database
                process.env.PGPASSWORD = password;
                await execAsync(`psql -h "${host}" -p ${port} -U "${username}" -c "CREATE DATABASE ${testDbName};"`);
                // Restore backup
                await execAsync(`pg_restore -h "${host}" -p ${port} -U "${username}" -d "${testDbName}" "${backupPath}"` +
                    ' || psql -h "${host}" -p ${port} -U "${username}" "${testDbName}" < "${backupPath}"');
                // Verify tables exist
                const { stdout } = await execAsync(`psql -h "${host}" -p ${port} -U "${username}" -c "\\dt" "${testDbName}"`);
                if (!stdout.includes('row')) {
                    throw new Error('No tables found in restored database');
                }
                // Cleanup test database
                await execAsync(`psql -h "${host}" -p ${port} -U "${username}" -c "DROP DATABASE ${testDbName};"`);
            }
            return {
                success: true,
                path: testDbName,
                duration: 0,
            };
        }
        catch (error) {
            // Cleanup on error
            try {
                if (dbType === 'mysql') {
                    await execAsync(`mysql -h "${host}" -P ${port} -u "${username}" -p"${password}" -e "DROP DATABASE IF EXISTS ${testDbName};"`);
                }
                else {
                    await execAsync(`psql -h "${host}" -p ${port} -U "${username}" -c "DROP DATABASE IF EXISTS ${testDbName};"`);
                }
            }
            catch {
                // Ignore cleanup errors
            }
            throw error;
        }
    }
    async restoreCloudBackup(backupPath, restorePath) {
        // Cloud backups are downloaded to local temp first, then treated as file backups
        return this.restoreFile(backupPath, restorePath);
    }
    async copyDirectory(src, dest) {
        await fs.promises.mkdir(dest, { recursive: true });
        const entries = await fs.promises.readdir(src, { withFileTypes: true });
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            if (entry.isDirectory()) {
                await this.copyDirectory(srcPath, destPath);
            }
            else {
                await fs.promises.copyFile(srcPath, destPath);
            }
        }
    }
    async verifyRestoredContent(restorePath) {
        // Verify we can read the restored files
        const entries = await fs.promises.readdir(restorePath, { withFileTypes: true });
        if (entries.length === 0) {
            throw new Error('Restored directory is empty');
        }
        // Try to read at least one file to verify it's not corrupted
        for (const entry of entries) {
            if (entry.isFile()) {
                const filePath = path.join(restorePath, entry.name);
                const fd = await fs.promises.open(filePath, 'r');
                const buffer = Buffer.alloc(1024);
                await fd.read(buffer, 0, 1024, 0);
                await fd.close();
                break;
            }
        }
    }
    async cleanup(restorePath) {
        try {
            await fs.promises.rm(restorePath, { recursive: true, force: true });
        }
        catch {
            // Ignore cleanup errors
        }
    }
}
exports.RestoreTester = RestoreTester;
//# sourceMappingURL=restore.js.map