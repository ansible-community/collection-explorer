import * as vscode from 'vscode';
import { getCollectionPaths } from './lib';

export class NodeDependenciesProvider implements vscode.TreeDataProvider<CollectionTree> {
  constructor(private workspaceRoot: string) {}

  getTreeItem(element: CollectionTree): vscode.TreeItem {
    return element;
  }

  getChildren(element?: CollectionTree): Thenable<CollectionTree[]> {
    if (!element) {
      return new Promise<CollectionTree[]>((resolve, reject) =>
        getCollectionPaths().then(paths => {
          const children: CollectionTree[] = [];
          for (const path of paths) {
            children.push(
              new CollectionTree(path, '', 'dir', vscode.TreeItemCollapsibleState.Collapsed)
            );
          }
          resolve(children);
        })
      );
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

class CollectionTree extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private version: string,
    public readonly itemType: 'dir' | 'collection' | 'category' | 'content',
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }

  get tooltip(): string {
    return this.label;
  }

  get description(): string {
    return this.version;
  }

  // iconPath = {
  //   light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
  //   dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
  // };
}
