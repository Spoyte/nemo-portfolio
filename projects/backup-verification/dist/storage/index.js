"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SFTPStorageBackend = exports.S3StorageBackend = exports.LocalStorageBackend = exports.StorageFactory = void 0;
const local_1 = require("./local");
const s3_1 = require("./s3");
const sftp_1 = require("./sftp");
class StorageFactory {
    static createBackend(config) {
        switch (config.type) {
            case 'local':
                return new local_1.LocalStorageBackend(config);
            case 's3':
                return new s3_1.S3StorageBackend(config);
            case 'sftp':
                return new sftp_1.SFTPStorageBackend(config);
            default:
                throw new Error(`Unknown storage backend type: ${config.type}`);
        }
    }
}
exports.StorageFactory = StorageFactory;
var local_2 = require("./local");
Object.defineProperty(exports, "LocalStorageBackend", { enumerable: true, get: function () { return local_2.LocalStorageBackend; } });
var s3_2 = require("./s3");
Object.defineProperty(exports, "S3StorageBackend", { enumerable: true, get: function () { return s3_2.S3StorageBackend; } });
var sftp_2 = require("./sftp");
Object.defineProperty(exports, "SFTPStorageBackend", { enumerable: true, get: function () { return sftp_2.SFTPStorageBackend; } });
//# sourceMappingURL=index.js.map