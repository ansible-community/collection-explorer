"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const collections_1 = require("./collections");
const doc_loader_1 = require("./view/doc-loader");
const child_process_1 = require("child_process");
const Path = require("path");
const lib_1 = require("./lib");
function activate(context) {
    const config = vscode.workspace.getConfiguration('ansibleCollections');
    const out = child_process_1.execSync('python -c "help(\'modules\');"', {
        env: { PATH: `${Path.join(config.pythonVirtualEnvironment, '/bin/')}:${process.env.PATH}` }
    }).toString();
    if (!out.includes('galaxy_importer')) {
        vscode.window.showErrorMessage('galaxy-importer is required to load ansible collections. ' +
            'Please pip install galaxy-importer. If you wish to install' +
            ' the importer in a virtual environment, you can specify the virtual' +
            ' env the extension uses in settings.');
    }
    else {
        const loader = new lib_1.CollectionLoader(context.globalStoragePath);
        vscode.window.createTreeView('ansibleCollections', {
            treeDataProvider: new collections_1.CollectionTreeProvider(loader, context)
        });
        vscode.commands.registerCommand('ansibleCollections.loadCollectionDoc', (collectionID, contentIdentifiers) => {
            doc_loader_1.DocLoader.loadDoc(collectionID, contentIdentifiers, context, loader);
        });
    }
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map