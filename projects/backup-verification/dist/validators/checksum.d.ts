import { ChecksumAlgorithm, ChecksumInfo } from '../types';
export declare class ChecksumValidator {
    static calculate(filePath: string, algorithm?: ChecksumAlgorithm): Promise<ChecksumInfo>;
    static calculateBuffer(buffer: Buffer, algorithm?: ChecksumAlgorithm): Promise<ChecksumInfo>;
    static verify(filePath: string, expectedChecksum: string, algorithm?: ChecksumAlgorithm): Promise<{
        valid: boolean;
        actual: string;
    }>;
    static parseChecksumFile(checksumFile: string): Promise<Map<string, string>>;
    static verifyFromChecksumFile(filePath: string, checksumFile: string, algorithm?: ChecksumAlgorithm): Promise<{
        valid: boolean;
        expected?: string;
        actual: string;
    }>;
    static detectAlgorithm(checksum: string): ChecksumAlgorithm;
}
//# sourceMappingURL=checksum.d.ts.map