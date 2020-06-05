import * as vscode from 'vscode';
import { CollectionLoader } from './lib';
import { CollectionType, ImportStatusType, DocsEntryType } from './types';
import * as Path from 'path';

export class CollectionTreeProvider implements vscode.TreeDataProvider<CollectionTree> {
  private collections: { name: string; namespace: string; path: string; id: string }[];
  private collectionData: { byID: { [key: string]: Promise<CollectionType> } };

  constructor(
    private collectionLoader: CollectionLoader,
    private context: vscode.ExtensionContext
  ) {
    const data = this.collectionLoader.getCollectionList();
    const importerScript = Path.join(this.context.extensionPath, 'python', 'importer_wrapper.py');
    this.collections = [];
    this.collectionData = { byID: {} };

    const config = vscode.workspace.getConfiguration('ansibleCollections');
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
      } else {
        // If the index doesn't exist, load the collection via the galaxy-importer
        this.collectionData.byID[id] = new Promise((resolve, reject) => {
          console.log(`Executing tasking. Import: ${collection.name}`);
          this.collectionLoader
            .importCollection(collection.path, id, {
              onStandardErr: msg => console.error(msg.toString()),
              virtualenv: config.pythonVirtualEnvironment,
              importerScript: importerScript
            })
            .then(() => {
              const importResult = this.collectionLoader.getCollection(id);
              const index = CollectionLoader.getCollectionIndex(importResult.docs_blob);
              console.log(`Import done: ${collection.name}`);

              resolve({
                name: collection.name,
                namespace: collection.namespace,
                path: collection.path,
                index: index,
                metadata: importResult.metadata,
                status: ImportStatusType.imported
              });
            })
            .catch(err => reject(err));
        });
      }
    }
  }

  getTreeItem(parent: CollectionTree): vscode.TreeItem {
    return parent;
  }

  getChildren(parent?: CollectionTree): Thenable<CollectionTree[]> {
    if (!parent) {
      const children: CollectionTree[] = [];
      for (const collection of this.collections) {
        children.push(
          new CollectionTree({
            label: `${collection.namespace}.${collection.name}`,
            itemType: 'collection',
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
            collectionID: collection.id
          })
        );
      }

      return Promise.resolve(children);
    } else {
      return new Promise<CollectionTree[]>((resolve, reject) => {
        this.collectionData.byID[parent.config.collectionID]
          .then((collection: CollectionType) => {
            const children: CollectionTree[] = [];

            switch (parent.config.itemType) {
              case 'collection':
                for (const key in collection.index) {
                  const cat = collection.index[key];
                  if (cat.length !== 0) {
                    children.push(
                      new CollectionTree({
                        label: key,
                        itemType: 'category',
                        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
                        collectionID: parent.config.collectionID
                      })
                    );
                  }
                }
                resolve(children);
                break;

              case 'category':
                for (const content of collection.index[parent.config.label]) {
                  children.push(
                    new CollectionTree({
                      label: content.display,
                      collapsibleState: vscode.TreeItemCollapsibleState.None,
                      itemType: 'content',
                      collectionID: parent.config.collectionID,
                      command: {
                        command: 'ansibleCollections.loadCollectionDoc',
                        title: 'Load Collection Documentation',
                        arguments: [parent.config.collectionID, content]
                      }
                    })
                  );
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

class CollectionTree extends vscode.TreeItem {
  constructor(
    public config: {
      label: string;
      collapsibleState: vscode.TreeItemCollapsibleState;
      itemType: 'collection' | 'category' | 'content';
      collectionID: string;
      description?: string;
      tooltip?: string;
      command?: {
        command: string;
        title: string;
        arguments: any[];
      };
    }
  ) {
    super(config.label, config.collapsibleState);
    this.command = config.command;
  }

  get tooltip(): string {
    return this.config.tooltip || this.label;
  }

  get description(): string {
    return this.config.description;
  }

  // iconPath = {
  //   light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
  //   dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
  // };
}
