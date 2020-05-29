"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionLoader = void 0;
const child_process_1 = require("child_process");
const FS = require("fs");
const Path = require("path");
const lodash_1 = require("lodash");
const types_1 = require("../types");
const lib_1 = require("../lib");
class CollectionLoader {
    // Returns a list of directories with their respective collections
    static getCollectionList() {
        const directories = { byID: {} };
        const collections = { byID: {} };
        const collection_paths = lib_1.CollectionPathFinder.getPaths();
        for (const p of collection_paths) {
            const col = this.loadDir(p);
            directories.byID[lib_1.StateHelper.getID(p)] = {
                path: p,
                collectionIDs: Object.keys(col.byID)
            };
            collections.byID = Object.assign(Object.assign({}, collections.byID), col.byID);
        }
        return { collections: collections, directories: directories };
    }
    static getCollection(collectionID) {
        try {
            return JSON.parse(FS.readFileSync(this.getCachePath(collectionID)).toString());
        }
        catch (_a) {
            return null;
        }
    }
    static importCollection(collection_path, collectionID, callbacks) {
        return new Promise((resolve, reject) => {
            const rootDir = lib_1.getBasePath();
            let exe;
            let path;
            const args = [];
            // if running in production mode, use the bundled python scripts
            if (process.env.NODE_ENV === 'production') {
                exe = Path.join(rootDir, 'python', 'dist', 'importer_wrapper', 'importer_wrapper');
                path = `${Path.join(rootDir, 'python', 'dist', 'ansible-doc')}:${Path.join(rootDir, 'python', 'dist', 'ansible-lint')}:${process.env.PATH}`;
            }
            else {
                exe = 'python';
                path = process.env.PATH;
                args.push('python/importer_wrapper.py');
            }
            const p = child_process_1.spawn(exe, args.concat([collection_path, this.getCachePath(collectionID)]), {
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
                }
                else {
                    reject(code);
                }
            });
        });
    }
    static getCollectionIndex(docsBlob) {
        const table = {
            documentation: [],
            modules: [],
            roles: [],
            plugins: [],
            playbooks: []
        };
        table.documentation.push({
            display: 'Readme',
            type: 'docs',
            name: 'readme'
        });
        if (docsBlob.documentation_files) {
            for (const file of docsBlob.documentation_files) {
                table.documentation.push({
                    display: lodash_1.capitalize(file.name
                        .split('.')[0]
                        .split('_')
                        .join(' ')),
                    // selected: selectedType === 'docs' && selectedName === url,
                    type: 'docs',
                    name: file.name
                });
            }
        }
        const getContentEntry = (content) => {
            return {
                display: content.content_name,
                name: content.content_name,
                type: content.content_type
            };
        };
        if (docsBlob.contents) {
            for (const content of docsBlob.contents) {
                switch (content.content_type) {
                    case 'role':
                        table.roles.push(getContentEntry(content));
                        break;
                    case 'module':
                        table.modules.push(getContentEntry(content));
                        break;
                    case 'playbook':
                        table.playbooks.push(getContentEntry(content));
                        break;
                    default:
                        table.plugins.push(getContentEntry(content));
                        break;
                }
            }
        }
        // Sort docs
        for (const k of Object.keys(table)) {
            table[k].sort((a, b) => {
                // Make sure that anything starting with _ goes to the bottom
                // of the list
                if (a.display.startsWith('_') && !b.display.startsWith('_')) {
                    return 1;
                }
                if (!a.display.startsWith('_') && b.display.startsWith('_')) {
                    return -1;
                }
                return a.display > b.display ? 1 : -1;
            });
        }
        return table;
    }
    static getContent(collection, selectedName, selectedType) {
        let displayHTML;
        let pluginData;
        if (selectedType === 'docs' && selectedName && selectedName !== 'readme') {
            if (collection.docs_blob.documentation_files) {
                const file = collection.docs_blob.documentation_files.find(x => x.name === selectedName);
                if (file) {
                    return { type: 'html', data: file.html };
                }
            }
        }
        else if (selectedType !== 'docs' && selectedName) {
            // check if contents exists
            if (collection.docs_blob.contents) {
                const content = collection.docs_blob.contents.find(x => x.content_type === selectedType && x.content_name === selectedName);
                if (content) {
                    if (selectedType === 'role') {
                        return { type: 'html', data: content['readme_html'] };
                    }
                    else {
                        return { type: 'plugin', data: content };
                    }
                }
            }
        }
        else {
            if (collection.docs_blob.collection_readme) {
                return { type: 'html', data: collection.docs_blob.collection_readme.html };
            }
        }
        return null;
    }
    static loadDir(collectionsDir) {
        // Returns a list of collection in a given directory
        const collections = { byID: {} };
        for (const ns of FS.readdirSync(collectionsDir)) {
            if (FS.statSync(Path.join(collectionsDir, ns)).isDirectory()) {
                for (const collection of FS.readdirSync(Path.join(collectionsDir, ns))) {
                    const collectionDir = Path.join(collectionsDir, ns, collection);
                    if (FS.statSync(collectionDir).isDirectory() &&
                        this.isCollection(FS.readdirSync(collectionDir))) {
                        const collectionPath = Path.join(collectionsDir, ns, collection);
                        const id = lib_1.StateHelper.getID(collectionPath);
                        let index = null;
                        let metadata = null;
                        let status = types_1.ImportStatusType.loading;
                        // don't load the index for collections that are out of
                        // date. This will cause the collection to get reimported
                        if (!this.needsRefresh(collectionPath, id)) {
                            const importerData = this.getCollection(id);
                            status = types_1.ImportStatusType.imported;
                            if (importerData) {
                                index = this.getCollectionIndex(importerData.docs_blob);
                                metadata = importerData.metadata;
                            }
                        }
                        collections.byID[id] = {
                            name: collection,
                            namespace: ns,
                            path: collectionPath,
                            index: index,
                            metadata: metadata,
                            status: status
                        };
                    }
                }
            }
        }
        return collections;
    }
    static needsRefresh(collectionPath, collectionID) {
        const recursiveFilesChanged = (dir, compareDate) => {
            // Compares all the files in the directory tree to the given date.
            // if any of the files are new returns true, else returns false.
            const dirs = [];
            for (let file of FS.readdirSync(dir)) {
                file = Path.join(dir, file);
                const fStat = FS.statSync(file);
                if (fStat.mtime > compareDate) {
                    return true;
                }
                if (fStat.isDirectory()) {
                    dirs.push(file);
                }
            }
            for (const subdir of dirs) {
                return recursiveFilesChanged(subdir, compareDate);
            }
            return false;
        };
        if (FS.existsSync(this.getCachePath(collectionID))) {
            const collectionRootStat = FS.statSync(collectionPath);
            const collectionCache = FS.statSync(this.getCachePath(collectionID));
            // The root directory has to be checked individually because this is
            // the only place that the modified date of deleting files in the
            // root directory is tracked
            if (collectionRootStat.mtime > collectionCache.mtime) {
                return true;
            }
            return recursiveFilesChanged(collectionPath, collectionCache.mtime);
        }
        return true;
    }
    static getCachePath(collectionID) {
        return Path.join(lib_1.Config.getCacheDir(), collectionID);
    }
    static isCollection(files) {
        return (files.includes('MANIFEST.json') ||
            files.includes('galaxy.yaml') ||
            files.includes('galaxy.yml'));
    }
}
exports.CollectionLoader = CollectionLoader;
//# sourceMappingURL=collection-loader.js.map