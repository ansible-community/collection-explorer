import * as vscode from 'vscode';
import { CollectionTreeProvider } from './collections';
import { DocsEntryType } from './types';
import { DocLoader } from './view/doc-loader';
import { execSync } from 'child_process';
import * as Path from 'path';

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('ansibleCollections');

  const out = execSync('python -c "help(\'modules\');"', {
    env: { PATH: `${Path.join(config.pythonVirtualEnvironment, '/bin/')}:${process.env.PATH}` }
  }).toString();

  if (!out.includes('galaxy_importer')) {
    vscode.window.showErrorMessage(
      'galaxy-importer is required to load ansible collections. ' +
        'Please pip install galaxy-importer. If you wish to install' +
        ' the importer in a virtual environment, you can specify the virtual' +
        ' env the extension uses in settings.'
    );
  } else {
    vscode.window.createTreeView('ansibleCollections', {
      treeDataProvider: new CollectionTreeProvider(context)
    });
    vscode.commands.registerCommand(
      'ansibleCollections.loadCollectionDoc',
      (collectionID: string, contentIdentifiers: DocsEntryType) => {
        DocLoader.loadDoc(collectionID, contentIdentifiers, context);
      }
    );
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
