import * as React from 'react';
import './collection-loader.scss';

import { CollectionLoader } from '../../lib';
import { Button, Tooltip } from '@patternfly/react-core';
import { RedoIcon } from '@patternfly/react-icons';

import { Tab, CollectionList } from '../components';

import { ViewType, TabType, DirectoriesType, CollectionsType } from '../../types';

interface IState {
    directories: DirectoriesType;
    collections: CollectionsType;
    contentSelected: {
        tab: number;
    };

    sidebarSelected: {
        directoryID: string;
        collectionID: string;
        contentType: string;
        contentName: string;
    };

    tabs: TabType[];
}

// renders markdown files in collection docs/ directory
export class Root extends React.Component<{}, IState> {
    docsRef: any;

    constructor(props) {
        super(props);

        this.state = {
            directories: { byID: {} },
            collections: { byID: {} },

            sidebarSelected: {
                directoryID: null,
                collectionID: null,
                contentType: null,
                contentName: null
            },

            contentSelected: {
                tab: 0
            },
            tabs: [{ view: null, data: null }]
        };

        this.docsRef = React.createRef();
    }

    componentDidMount() {
        this.loadCollectionList();
    }

    render() {
        const { directories, collections, tabs, contentSelected } = this.state;
        console.log(this.state);
        return (
            <div className="main">
                <div>
                    <CollectionList
                        directories={directories}
                        collections={collections}
                        selectCollection={collection =>
                            this.setState(
                                {
                                    sidebarSelected: {
                                        ...this.state.sidebarSelected,
                                        collectionID: collection
                                    }
                                },
                                () => this.loadCollectionDetail(collection)
                            )
                        }
                    />
                </div>
                <div className="docs-col">
                    <Tab
                        tabs={tabs}
                        contentSelected={contentSelected}
                        collections={collections}
                        importCollection={collectionID => this.importCollection(collectionID)}
                    />
                </div>
            </div>
        );
    }

    private loadCollectionList() {
        const data = CollectionLoader.getCollectionList();
        this.setState({ directories: data.directories, collections: data.collections });
    }
    private importCollection(collectionID: string) {
        const tabs = [...this.state.tabs];
        const currentTab = this.state.contentSelected.tab;
        tabs[currentTab] = {
            view: ViewType.loading,
            data: { collectionID: collectionID }
        };
        this.setState({ tabs: tabs }, () => {
            CollectionLoader.importCollection(this.state.collections.byID[collectionID].path, {
                onStandardErr: error => console.error(`stderr: ${error.toString()}`)
            })
                .then(() => {
                    this.loadCollectionDetail(collectionID);
                })
                .catch(() => {
                    const newTabs = { ...tabs };
                    newTabs[currentTab] = {
                        view: ViewType.error,
                        data: { collectionID: collectionID }
                    };
                    this.setState({ tabs: tabs });
                });
        });
    }

    private loadCollectionDetail(collectionID) {
        const tabID = this.state.contentSelected.tab;
        try {
            const data = CollectionLoader.getCollection(
                this.state.collections.byID[collectionID].path
            );

            const newCollections = { ...this.state.collections };
            const newTabs = [...this.state.tabs];
            newTabs[tabID] = { view: ViewType.docs, data: { collectionID: collectionID } };
            newCollections.byID[collectionID].importedData = data;

            this.setState({ collections: newCollections, tabs: newTabs });
        } catch {
            const newTabs = [...this.state.tabs];
            newTabs[tabID] = { view: ViewType.load, data: { collectionID: collectionID } };

            this.setState({ tabs: newTabs });
        }
    }
}
