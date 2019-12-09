import { spawn } from 'child_process';
import * as FS from 'fs';
import * as Path from 'path';

import { DirectoryListType } from '../renderer/components';
import { CollectionPathFinder, getBasePath } from '../lib';

export class CollectionLoader {
    // Returns a list of directories with their respective collections
    static getCollectionList(): DirectoryListType[] {
        const directories: DirectoryListType[] = [];
        const collection_paths = CollectionPathFinder.getPaths();

        for (const p of collection_paths) {
            directories.push({
                path: p,
                collections: this.loadDir(p)
            });
        }

        return directories;
    }

    static getCollection(path) {
        const file = Path.join(path, '_collection_explorer_cache.json');
        return JSON.parse(FS.readFileSync(file).toString());
    }

    static importCollection(
        collection_path: string,
        callbacks?: { onStandardErr?: (message) => void; onStandardOut?: (message) => void }
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const rootDir = getBasePath();
            let exe: string;
            let path: string;
            const args = [];

            // if running in production mode, use the bundled python scripts
            if (process.env.NODE_ENV === 'production') {
                exe = Path.join(rootDir, 'python', 'dist', 'importer_wrapper', 'importer_wrapper');
                path = `${Path.join(rootDir, 'python', 'dist', 'ansible-doc')}:${Path.join(
                    rootDir,
                    'python',
                    'dist',
                    'ansible-lint'
                )}:${process.env.PATH}`;
            } else {
                exe = 'python';
                path = process.env.PATH;
                args.push('python/importer_wrapper.py');
            }

            const p = spawn(exe, args.concat([collection_path]), {
                env: {
                    PATH: path
                }
            });

            p.stdout.on('data', data => {
                if (callbacks && callbacks.onStandardOut) {
                    callbacks.onStandardOut(data);
                }
            });
            p.stderr.on('data', data => {
                if (callbacks && callbacks.onStandardErr) {
                    callbacks.onStandardErr(data);
                }
                // console.error(`stderr: ${data}`);
            });
            p.on('exit', code => {
                // this.setState({ collection: JSON.parse(allData.join()) });
                // console.log(JSON.parse(allData.join()));

                if (code === 0) {
                    resolve(code);
                } else {
                    reject(code);
                }
            });
        });
    }

    private static loadDir(c_path) {
        // Returns a list of collection in a given directory
        const collections = [];
        for (const ns of FS.readdirSync(c_path)) {
            if (FS.statSync(Path.join(c_path, ns)).isDirectory()) {
                for (const collection of FS.readdirSync(Path.join(c_path, ns))) {
                    const collectionDir = Path.join(c_path, ns, collection);

                    if (
                        FS.statSync(collectionDir).isDirectory() &&
                        this.isCollection(FS.readdirSync(collectionDir))
                    ) {
                        collections.push({
                            name: collection,
                            namespace: ns,
                            path: Path.join(c_path, ns, collection)
                        });
                    }
                }
            }
        }

        return collections;
    }

    private static isCollection(files: string[]): boolean {
        return (
            files.includes('MANIFEST.json') ||
            files.includes('galaxy.yaml') ||
            files.includes('galaxy.yml')
        );
    }
}
