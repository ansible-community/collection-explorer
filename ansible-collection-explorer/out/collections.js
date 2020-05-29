"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeDependenciesProvider = void 0;
const vscode = require("vscode");
const lib_1 = require("./lib");
class NodeDependenciesProvider {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            return new Promise((resolve, reject) => lib_1.getCollectionPaths().then(paths => {
                const children = [];
                for (const path of paths) {
                    children.push(new CollectionTree(path, '', 'dir', vscode.TreeItemCollapsibleState.Collapsed));
                }
                resolve(children);
            }));
        }
        // return Promise.resolve([]);
        // const children: CollectionTree[] = [];
        // for (let i = 0; i < 10; i++) {
        //   children.push(
        //     new CollectionTree('hi', 'hi', 'dir', vscode.TreeItemCollapsibleState.Collapsed)
        //   );
        // }
        // return Promise.resolve(children);
    }
}
exports.NodeDependenciesProvider = NodeDependenciesProvider;
class CollectionTree extends vscode.TreeItem {
    constructor(label, version, itemType, collapsibleState) {
        super(label, collapsibleState);
        this.label = label;
        this.version = version;
        this.itemType = itemType;
        this.collapsibleState = collapsibleState;
    }
    get tooltip() {
        return this.label;
    }
    get description() {
        return this.version;
    }
}
//# sourceMappingURL=collections.js.map