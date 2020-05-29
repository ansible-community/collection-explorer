import * as fs from 'fs';
import * as os from 'os';
import * as Path from 'path';
import * as process from 'process';
import * as YAML from 'js-yaml';
import * as INI from 'ini';

import { getBasePath } from './base-path';

export class CollectionPathFinder {
    static getPaths(): string[] {
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

    private static getAnsibleConfigPaths(varConfig): string {
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

    private static parseConfig(varConfig, configPath: string): string {
        const ini = INI.parse(fs.readFileSync(configPath).toString());
        const iniLocation = varConfig.ini[0];

        try {
            return ini[iniLocation.section][iniLocation.key];
        } catch {
            return null;
        }
    }

    private static parsevarConfig() {
        const varConfigPath = Path.join(
            getBasePath(),
            'python',
            'dist',
            'ansible-doc',
            'ansible',
            'config',
            'base.yml'
        );

        const data = YAML.safeLoad(fs.readFileSync(varConfigPath).toString());

        return data['COLLECTIONS_PATHS'];
    }

    private static parsePaths(paths: string): string[] {
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
                } else {
                    out.push(path);
                }
            }
        }

        return out;
    }
}
