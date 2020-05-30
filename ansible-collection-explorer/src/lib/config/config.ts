import * as OS from 'os';
import * as Path from 'path';
import * as FS from 'fs';
import * as Crypto from 'crypto';

const DEFAULT_CONFIG_DIR = Path.join(OS.homedir(), '.collection_explorer');
const DEFAULT_CONFIG_FILE = Path.join(DEFAULT_CONFIG_DIR, 'config.yaml');
const DEFAULT_CACHE_DIR = Path.join(DEFAULT_CONFIG_DIR, 'collection_cache');

class ConfigClass {
    config = {};

    constructor() {
        // ensure all the correct directories are present
        for (const dir of [DEFAULT_CONFIG_DIR, DEFAULT_CACHE_DIR]) {
            if (!FS.existsSync(dir) || !FS.statSync(dir).isDirectory()) {
                FS.mkdirSync(dir, { recursive: true });
            }
        }
    }

    private loadConfig() {}

    getConfigDir() {
        return DEFAULT_CONFIG_DIR;
    }

    getCacheDir() {
        return DEFAULT_CACHE_DIR;
    }
}

// export this as initialized to ensure that settings validation only happens
// once
export const Config = new ConfigClass();
