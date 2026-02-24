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
const commander_1 = require("commander");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const config_1 = require("./validators/config");
const verifier_1 = require("./scheduler/verifier");
const scheduler_1 = require("./scheduler");
const logger_1 = require("./utils/logger");
const program = new commander_1.Command();
program
    .name('backup-verify')
    .description('Automated backup integrity verification system')
    .version('1.0.0');
program
    .command('init')
    .description('Generate example configuration file')
    .option('-o, --output <file>', 'Output file path', 'backup-verify.yaml')
    .action((options) => {
    const outputPath = path.resolve(options.output);
    if (fs.existsSync(outputPath)) {
        console.error(`File already exists: ${outputPath}`);
        process.exit(1);
    }
    config_1.ConfigLoader.saveExample(outputPath);
    console.log(`✅ Example configuration created: ${outputPath}`);
    console.log('Edit this file to configure your backup verifications.');
});
program
    .command('validate')
    .description('Validate configuration file')
    .requiredOption('-c, --config <file>', 'Configuration file path')
    .action((options) => {
    try {
        const configPath = path.resolve(options.config);
        const config = config_1.ConfigLoader.load(configPath);
        console.log('✅ Configuration is valid');
        console.log(`   Version: ${config.version}`);
        console.log(`   Verifications: ${config.verifications.length}`);
        console.log(`   Enabled: ${config.verifications.filter(v => v.enabled).length}`);
    }
    catch (error) {
        console.error('❌ Configuration validation failed:');
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
});
program
    .command('verify')
    .description('Run backup verification(s)')
    .requiredOption('-c, --config <file>', 'Configuration file path')
    .option('-n, --name <name>', 'Verify specific backup by name')
    .option('-o, --output <dir>', 'Report output directory', './reports')
    .action(async (options) => {
    try {
        const configPath = path.resolve(options.config);
        const config = config_1.ConfigLoader.load(configPath);
        const logger = (0, logger_1.createLogger)(config.logLevel);
        const verifier = new verifier_1.BackupVerifier(config);
        if (options.name) {
            const verification = verifier.getVerification(options.name);
            if (!verification) {
                console.error(`Verification not found: ${options.name}`);
                process.exit(1);
            }
            logger.info(`Running verification: ${options.name}`);
            const result = await verifier.verify(verification);
            console.log(`\nResult: ${result.success ? '✅ PASS' : '❌ FAIL'}`);
            console.log(`Duration: ${result.duration}ms`);
            console.log(`Checksum: ${result.checksumValid ? 'Valid' : 'Invalid'}`);
            if (result.restoreTest?.attempted) {
                console.log(`Restore: ${result.restoreTest.success ? 'Success' : 'Failed'}`);
            }
            if (result.errors.length > 0) {
                console.log('\nErrors:');
                result.errors.forEach(e => console.log(`  - ${e}`));
            }
            process.exit(result.success ? 0 : 1);
        }
        else {
            const report = await verifier.verifyAll();
            process.exit(report.failed > 0 ? 1 : 0);
        }
    }
    catch (error) {
        console.error('❌ Verification failed:');
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
});
program
    .command('schedule')
    .description('Start scheduled verification service')
    .requiredOption('-c, --config <file>', 'Configuration file path')
    .option('-d, --daemon', 'Run as daemon (keep running)')
    .action(async (options) => {
    try {
        const configPath = path.resolve(options.config);
        const config = config_1.ConfigLoader.load(configPath);
        const logger = (0, logger_1.createLogger)(config.logLevel);
        const scheduler = new scheduler_1.VerificationScheduler(config);
        scheduler.start();
        const scheduledTasks = scheduler.getScheduledTasks();
        console.log(`✅ Scheduler started with ${scheduledTasks.length} task(s)`);
        for (const task of scheduledTasks) {
            const verification = config.verifications.find(v => v.name === task);
            console.log(`   - ${task}: ${verification?.schedule}`);
        }
        if (options.daemon || scheduledTasks.length > 0) {
            // Keep running
            process.on('SIGINT', () => {
                logger.info('Received SIGINT, shutting down...');
                scheduler.stop();
                process.exit(0);
            });
            process.on('SIGTERM', () => {
                logger.info('Received SIGTERM, shutting down...');
                scheduler.stop();
                process.exit(0);
            });
            // Keep the process alive
            setInterval(() => { }, 60000);
        }
        else {
            console.log('No scheduled tasks configured. Exiting.');
            scheduler.stop();
        }
    }
    catch (error) {
        console.error('❌ Scheduler failed:');
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
});
program
    .command('list')
    .description('List configured verifications')
    .requiredOption('-c, --config <file>', 'Configuration file path')
    .action((options) => {
    try {
        const configPath = path.resolve(options.config);
        const config = config_1.ConfigLoader.load(configPath);
        console.log('\nConfigured Verifications:');
        console.log('========================\n');
        for (const v of config.verifications) {
            const status = v.enabled ? '✅' : '⏸️';
            const schedule = v.schedule ? `(${v.schedule})` : '(manual)';
            console.log(`${status} ${v.name} [${v.source.type}] ${schedule}`);
            console.log(`   Checksum: ${v.verifyChecksum ? v.checksumAlgorithm : 'disabled'}`);
            console.log(`   Restore test: ${v.testRestore ? 'enabled' : 'disabled'}`);
            if (v.retention) {
                console.log(`   Retention: ${v.retention.days} days, keep last ${v.retention.keepLast || 'N/A'}`);
            }
            console.log('');
        }
    }
    catch (error) {
        console.error('❌ Failed to list verifications:');
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
});
program.parse();
//# sourceMappingURL=cli.js.map