"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionPathFinder = void 0;
const fs = require("fs");
const os = require("os");
const Path = require("path");
const process = require("process");
const YAML = require("js-yaml");
const INI = require("ini");
const base_path_1 = require("./base-path");
class CollectionPathFinder {
    static getPaths() {
        const varConfig = this.parsevarConfig();
        const envVar = varConfig.env[0].name;
        // Check environment variables for colection paths
        if (process.env[envVar]) {
            return this.parsePaths(process.env[envVar]);
        }
        // Find and check ansible.cfg for colection paths
        const configPaths = this.getAnsibleConfigPaths(varConfig);
        if (configPaths) {
            return this.parsePaths(configPaths);
        }
        // Return default collection paths
        return this.parsePaths(varConfig.default);
    }
    static getAnsibleConfigPaths(varConfig) {
        const paths = [
            process.env['ANSIBLE_CONFIG'],
            Path.join(os.homedir(), '.ansible.cfg'),
            '/etc/ansible/ansible.cfg'
        ];
        for (const path of paths) {
            if (path && fs.existsSync(path)) {
                return this.parseConfig(varConfig, path);
            }
        }
        return null;
    }
    static parseConfig(varConfig, configPath) {
        const ini = INI.parse(fs.readFileSync(configPath).toString());
        const iniLocation = varConfig.ini[0];
        try {
            return ini[iniLocation.section][iniLocation.key];
        }
        catch (_a) {
            return null;
        }
    }
    static parsevarConfig() {
        const varConfigPath = Path.join(base_path_1.getBasePath(), 'python', 'dist', 'ansible-doc', 'ansible', 'config', 'base.yml');
        const data = YAML.safeLoad(fs.readFileSync(varConfigPath).toString());
        return data['COLLECTIONS_PATHS'];
    }
    static parsePaths(paths) {
        const p = paths.split(':');
        const out = [];
        for (let path of p) {
            if (path.startsWith('~')) {
                path = Path.join(os.homedir(), path.substring(1));
            }
            if (fs.existsSync(path) && fs.statSync(path).isDirectory()) {
                const files = fs.readdirSync(path);
                if (files.includes('ansible_collections')) {
                    out.push(Path.join(path, 'ansible_collections'));
                }
                else {
                    out.push(path);
                }
            }
        }
        return out;
    }
}
exports.CollectionPathFinder = CollectionPathFinder;
//# sourceMappingURL=collection-path-finder.js.map