import * as React from 'react';
import './collection-loader.scss';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as process from 'process';
import * as appRootDir from 'app-root-dir';

import { Button, Tooltip } from '@patternfly/react-core';
import { RedoIcon } from '@patternfly/react-icons';

import { CollectionDocs, CollectionList, CollectionFileType } from '../components';

enum View {
    docs = 'docs',
    load = 'load',
    loading = 'loading',
    error = 'error'
}

interface IState {
    collection: any;
    collectionList: CollectionFileType[];
    selectedCollection: CollectionFileType;
    selectedName: string;
    selectedType: string;
    view: View;
}

// renders markdown files in collection docs/ directory
export class CollectionLoader extends React.Component<{}, IState> {
    docsRef: any;

    constructor(props) {
        super(props);

        this.state = {
            collection: undefined,
            collectionList: [],
            selectedCollection: undefined,
            selectedName: '',
            selectedType: 'docs',
            view: null
        };

        this.docsRef = React.createRef();
    }

    componentDidMount() {
        this.loadCollectionList();
    }

    render() {
        const { collection, collectionList, selectedCollection } = this.state;
        return (
            <div className="main">
                <div>
                    <CollectionList
                        collectionList={collectionList}
                        selectedCollection={selectedCollection}
                        selectCollection={collection =>
                            this.setState({ selectedCollection: collection }, () =>
                                this.loadCollectionDetail()
                            )
                        }
                    />
                </div>
                <div className="docs-col">{this.renderDocColumn()}</div>
            </div>
        );
    }

    private renderDocColumn() {
        const { collection, collectionList, selectedCollection } = this.state;

        switch (this.state.view) {
            case View.docs:
                return (
                    <div>
                        <div className="collection-header">
                            <div className="pf-c-content">
                                <h1>
                                    {selectedCollection.namespace}.{selectedCollection.name}
                                </h1>
                            </div>
                            <div>
                                <Tooltip content="Reload Collection" entryDelay={0}>
                                    <RedoIcon
                                        className="reload-icon"
                                        onClick={() => this.importCollection()}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                        <div>
                            <CollectionDocs collection={this.state.collection} />
                        </div>
                    </div>
                );
            case View.load:
                return (
                    <div>
                        <Button onClick={() => this.importCollection()}>
                            Load {selectedCollection.namespace}.{selectedCollection.name}
                        </Button>
                    </div>
                );
            case View.loading:
                return <div>Loading collection</div>;
            case View.error:
                return <div>Error loading colleciton</div>;
        }
    }

    private loadCollectionList() {
        const c_path = os.homedir() + '/.ansible/collections/ansible_collections/';

        const collections = [];

        for (const ns of fs.readdirSync(c_path)) {
            if (fs.statSync(path.join(c_path, ns)).isDirectory()) {
                for (const collection of fs.readdirSync(path.join(c_path, ns))) {
                    if (this.isCollection(fs.readdirSync(path.join(c_path, ns, collection)))) {
                        collections.push({
                            name: collection,
                            namespace: ns,
                            path: path.join(c_path, ns, collection)
                        });
                    }
                }
            }
        }

        this.setState({ collectionList: collections });
    }

    private loadCollectionCache(file) {
        const data = JSON.parse(fs.readFileSync(file).toString());
        return data;
    }

    private importCollection() {
        this.setState({ view: View.loading }, () => {
            let rootDir = appRootDir.get();
            if (rootDir.endsWith('/app.asar')) {
                rootDir = rootDir.slice(0, -9);
            }

            const exe = rootDir + '/python/dist/importer_wrapper/importer_wrapper';
            const path =
                rootDir +
                '/python/dist/ansible-doc' +
                ':' +
                rootDir +
                '/python/dist/ansible-lint' +
                ':' +
                process.env.PATH;

            const p = spawn(exe, [this.state.selectedCollection.path], {
                env: {
                    PATH: path
                }
            });
            const consoleOut = [];
            p.stdout.on('data', data => {
                consoleOut.push(data);
            });
            p.stderr.on('data', data => {
                console.error(`stderr: ${data}`);
            });
            p.on('exit', code => {
                // this.setState({ collection: JSON.parse(allData.join()) });
                // console.log(JSON.parse(allData.join()));

                if (code === 0) {
                    this.loadCollectionDetail();
                } else {
                    this.setState({ view: View.error });
                }
            });
        });
    }

    private loadCollectionDetail() {
        const file = this.state.selectedCollection.path + '/_collection_explorer_cache.json';
        try {
            const data = this.loadCollectionCache(file);
            this.setState({ collection: data, view: View.docs });
        } catch {
            this.setState({ collection: undefined, view: View.load });
        }
    }

    private isCollection(files: string[]): boolean {
        return (
            files.includes('MANIFEST.json') ||
            files.includes('galaxy.yaml') ||
            files.includes('galaxy.yml')
        );
    }
}
