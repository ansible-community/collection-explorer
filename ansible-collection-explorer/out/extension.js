"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const collections_1 = require("./collections");
function activate(context) {
    vscode.window.createTreeView('ansibleCollections', {
        treeDataProvider: new collections_1.NodeDependenciesProvider(vscode.workspace.rootPath)
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map