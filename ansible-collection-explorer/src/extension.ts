import * as vscode from 'vscode';
import { NodeDependenciesProvider } from './collections';
export function activate(context: vscode.ExtensionContext) {
  vscode.window.createTreeView('ansibleCollections', {
    treeDataProvider: new NodeDependenciesProvider(vscode.workspace.rootPath as string)
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
