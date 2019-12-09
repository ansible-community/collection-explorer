import * as React from 'react';
import './collection-loader.scss';

import { CollectionLoader } from '../../lib';
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
export class Root extends React.Component<{}, IState> {
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
        const { directories, selectedCollection } = this.state;
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
        this.setState({ directories: CollectionLoader.getCollectionList() });
    }
    private importCollection() {
        this.setState({ view: View.loading }, () => {
            CollectionLoader.importCollection(this.state.selectedCollection.path, {
                onStandardErr: error => console.error(`stderr: ${error.toString()}`)
            })
                .then(() => {
                    this.loadCollectionDetail();
                })
                .catch(() => {
                    this.setState({ view: View.error });
                });
        });
    }

    private loadCollectionDetail() {
        try {
            const data = CollectionLoader.getCollection(this.state.selectedCollection.path);
            this.setState({ collection: data, view: View.docs });
        } catch {
            this.setState({ collection: undefined, view: View.load });
        }
    }
}
