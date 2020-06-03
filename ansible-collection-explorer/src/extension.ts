import * as vscode from 'vscode';
import { CollectionTreeProvider } from './collections';
import { DocsEntryType } from './types';
import { DocLoader } from './view/doc-loader'

export function activate(context: vscode.ExtensionContext) {
  vscode.window.createTreeView('ansibleCollections', {
    treeDataProvider: new CollectionTreeProvider(vscode.workspace.rootPath as string)
  });
  vscode.commands.registerCommand(
    'ansibleCollections.loadCollectionDoc',
    (collectionID: string, contentIdentifiers: DocsEntryType) => {
      DocLoader.loadDoc(collectionID, contentIdentifiers, context)
    }
  );
}


// this method is called when your extension is deactivated
export function deactivate() {}
