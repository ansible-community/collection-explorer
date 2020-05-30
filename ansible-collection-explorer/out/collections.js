"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeDependenciesProvider = void 0;
const vscode = require("vscode");
const lib_1 = require("./lib");
const types_1 = require("./types");
class NodeDependenciesProvider {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
        const data = lib_1.CollectionLoader.getCollectionList();
        this.collections = [];
        this.collectionData = { byID: {} };
        for (const id in data.collections.byID) {
            // Load the basic collection data into an array that will be used to populate
            // the top level list of collections
            const collection = data.collections.byID[id];
            this.collections.push({
                name: collection.name,
                namespace: collection.namespace,
                path: collection.path,
                id: id
            });
            // If the collection has an index that means that it has already been loaded
            // and is up to date, so all that needs to be done is return the collection
            // as part of the promise
            if (collection.index) {
                this.collectionData.byID[id] = new Promise(resolve => {
                    resolve(collection);
                });
            }
            else {
                // If the index doesn't exist, load the collection via the galaxy-importer
                this.collectionData.byID[id] = new Promise((resolve, reject) => {
                    console.log(`Executing tasking. Import: ${collection.name}`);
                    lib_1.CollectionLoader.importCollection(collection.path, id, {
                        onStandardErr: msg => console.error(msg.toString())
                    })
                        .then(() => {
                        const importResult = lib_1.CollectionLoader.getCollection(id);
                        const index = lib_1.CollectionLoader.getCollectionIndex(importResult.docs_blob);
                        resolve({
                            name: collection.name,
                            namespace: collection.namespace,
                            path: collection.path,
                            index: index,
                            metadata: importResult.metadata,
                            status: types_1.ImportStatusType.imported
                        });
                    })
                        .catch(err => reject(err));
                });
            }
        }
    }
    importCollection(path, id) {
        return {};
    }
    getTreeItem(parent) {
        return parent;
    }
    getChildren(parent) {
        if (!parent) {
            const children = [];
            for (const collection of this.collections) {
                children.push(new CollectionTree({
                    label: `${collection.namespace}.${collection.namespace}`,
                    itemType: 'collection',
                    collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
                    collectionID: collection.id
                }));
            }
            return Promise.resolve(children);
        }
        else {
            return new Promise((resolve, reject) => {
                this.collectionData.byID[parent.config.collectionID]
                    .then((collection) => {
                    const children = [];
                    switch (parent.config.itemType) {
                        case 'collection':
                            for (const key in collection.index) {
                                const cat = collection.index[key];
                                if (cat.length !== 0) {
                                    children.push(new CollectionTree({
                                        label: key,
                                        itemType: 'category',
                                        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
                                        collectionID: parent.config.collectionID
                                    }));
                                }
                            }
                            resolve(children);
                            break;
                        case 'category':
                            for (const content of collection.index[parent.config.label]) {
                                children.push(new CollectionTree({
                                    label: content.display,
                                    collapsibleState: vscode.TreeItemCollapsibleState.None,
                                    itemType: 'content',
                                    collectionID: parent.config.collectionID
                                }));
                            }
                            resolve(children);
                            break;
                        default:
                            reject();
                            break;
                    }
                })
                    .catch(() => {
                    vscode.window.showErrorMessage('Error loading collection');
                    reject();
                });
            });
        }
    }
}
exports.NodeDependenciesProvider = NodeDependenciesProvider;
class CollectionTree extends vscode.TreeItem {
    constructor(config) {
        super(config.label, config.collapsibleState);
        this.config = config;
    }
    get tooltip() {
        return this.config.tooltip || this.label;
    }
    get description() {
        return this.config.description;
    }
}
//# sourceMappingURL=collections.js.map