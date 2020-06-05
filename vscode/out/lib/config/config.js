"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const OS = require("os");
const Path = require("path");
const FS = require("fs");
const DEFAULT_CONFIG_DIR = Path.join(OS.homedir(), '.collection_explorer');
const DEFAULT_CACHE_DIR = Path.join(DEFAULT_CONFIG_DIR, 'collection_cache');
class ConfigClass {
    constructor() {
        this.config = {};
        // ensure all the correct directories are present
        for (const dir of [DEFAULT_CONFIG_DIR, DEFAULT_CACHE_DIR]) {
            if (!FS.existsSync(dir) || !FS.statSync(dir).isDirectory()) {
                FS.mkdirSync(dir, { recursive: true });
            }
        }
    }
    getConfigDir() {
        return DEFAULT_CONFIG_DIR;
    }
    getCacheDir() {
        return DEFAULT_CACHE_DIR;
    }
}
// export this as initialized to ensure that settings validation only happens
// once
exports.Config = new ConfigClass();
//# sourceMappingURL=config.js.map