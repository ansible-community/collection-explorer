import * as React from 'react';
import './collection-loader.scss';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as process from 'process';

import { getBasePath, CollectionPathFinder } from '../../lib';
import { Button, Tooltip } from '@patternfly/react-core';
import { RedoIcon } from '@patternfly/react-icons';

import {
    CollectionDocs,
    CollectionList,
    CollectionFileType,
    DirectoryListType
} from '../components';

enum View {
    docs = 'docs',
    load = 'load',
    loading = 'loading',
    error = 'error'
}

interface IState {
    collection: any;
    directories: DirectoryListType[];
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
            directories: [],
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
        const { collection, directories, selectedCollection } = this.state;
        return (
            <div className="main">
                <div>
                    <CollectionList
                        directories={directories}
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
        const { selectedCollection } = this.state;

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
        const directories = [];
        const collection_paths = CollectionPathFinder.getPaths();

        for (const p of collection_paths) {
            directories.push({
                path: p,
                collections: this.loadDir(p)
            });
        }

        this.setState({ directories: directories });
    }

    private loadDir(c_path) {
        const collections = [];
        for (const ns of fs.readdirSync(c_path)) {
            if (fs.statSync(path.join(c_path, ns)).isDirectory()) {
                for (const collection of fs.readdirSync(path.join(c_path, ns))) {
                    const collectionDir = path.join(c_path, ns, collection);

                    if (
                        fs.statSync(collectionDir).isDirectory() &&
                        this.isCollection(fs.readdirSync(collectionDir))
                    ) {
                        collections.push({
                            name: collection,
                            namespace: ns,
                            path: path.join(c_path, ns, collection)
                        });
                    }
                }
            }
        }

        return collections;
    }

    private loadCollectionCache(file) {
        const data = JSON.parse(fs.readFileSync(file).toString());
        return data;
    }

    private importCollection() {
        this.setState({ view: View.loading }, () => {
            const rootDir = getBasePath();
            let exe;
            let path;
            const args = [];

            // if running in production mode, use the bundled python scripts
            if (process.env.NODE_ENV === 'production') {
                exe = rootDir + '/python/dist/importer_wrapper/importer_wrapper';
                path =
                    rootDir +
                    '/python/dist/ansible-doc' +
                    ':' +
                    rootDir +
                    '/python/dist/ansible-lint' +
                    ':' +
                    process.env.PATH;
            } else {
                exe = 'python';
                path = process.env.PATH;
                args.push('python/importer_wrapper.py');
            }

            const p = spawn(exe, args.concat([this.state.selectedCollection.path]), {
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
