import { StorageBackend } from './base';
import { StorageBackendConfig } from '../types';
export declare class StorageFactory {
    static createBackend(config: StorageBackendConfig): StorageBackend;
}
export { StorageBackend };
export { LocalStorageBackend } from './local';
export { S3StorageBackend } from './s3';
export { SFTPStorageBackend } from './sftp';
//# sourceMappingURL=index.d.ts.map