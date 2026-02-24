import { Config } from '../types';
export declare class ConfigLoader {
    static load(configPath: string): Config;
    static validate(config: unknown): Config;
    static generateExample(): Config;
    static saveExample(configPath: string): void;
}
//# sourceMappingURL=config.d.ts.map