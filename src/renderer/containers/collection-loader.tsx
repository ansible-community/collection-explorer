import * as React from 'react';
import './collection-loader.scss';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { CollectionDocs, CollectionList, CollectionFileType } from '../components';

interface IState {
    collection: any;
    collectionList: CollectionFileType[];
    selectedCollection: CollectionFileType;
    selectedName: string;
    selectedType: string;
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
            selectedType: 'docs'
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
                {collection && (
                    <div>
                        <CollectionDocs collection={this.state.collection} />
                    </div>
                )}
            </div>
        );
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

    private loadCollectionDetail() {
        try {
            const data = JSON.parse(
                fs
                    .readFileSync(
                        this.state.selectedCollection.path + '/_collection_explorer_cache.json'
                    )
                    .toString()
            );
            console.log(data);
            this.setState({ collection: data });
        } catch {
            console.log('___________----____----___--___-___-____');
            const p = spawn('python', [
                'python/importer_wrapper.py',
                this.state.selectedCollection.path
            ]);

            const allData = [];
            p.stdout.on('data', data => {
                allData.push(data);
            });
            p.stderr.on('data', data => {
                // console.error(`stderr: ${data}`);
            });
            p.on('exit', code => {
                this.setState({ collection: JSON.parse(allData.join()) });
                // console.log(JSON.parse(allData.join()));
            });
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
