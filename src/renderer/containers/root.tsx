import * as React from 'react';
import './collection-loader.scss';

import { CollectionLoader, ImportManager } from '../../lib';
import { Tab, CollectionList } from '../components';

import { ViewType, TabType, DirectoriesType, CollectionsType, ImportStatusType } from '../../types';

interface IState {
    directories: DirectoriesType;
    collections: CollectionsType;
    contentSelected: {
        tab: number;
    };

    sidebarState: {
        width: number;
        expandedIDs: string[];
    };

    tabs: TabType[];
}

// renders markdown files in collection docs/ directory
export class Root extends React.Component<{}, IState> {
    docsRef: any;
    navRef: any;
    importQ: ImportManager;

    constructor(props) {
        super(props);

        this.state = {
            directories: { byID: {} },
            collections: { byID: {} },

            sidebarState: {
                width: 300,
                expandedIDs: []
            },

            contentSelected: {
                tab: 0
            },
            tabs: [{ view: null, data: null }]
        };

        this.navRef = React.createRef();
        this.docsRef = React.createRef();
        this.importQ = new ImportManager((err, task) => this.loadQueuedImport(err, task));
    }

    componentDidMount() {
        this.loadCollectionList();
    }

    render() {
        const { directories, collections, tabs, contentSelected, sidebarState } = this.state;
        return (
            <div className="main">
                <div className="nav" ref={this.navRef} style={{ width: `${sidebarState.width}px` }}>
                    <CollectionList
                        directories={directories}
                        collections={collections}
                        sidebarState={sidebarState}
                        toggleExpand={id => this.toggleExpand(id)}
                        loadContent={(collectionID, name, type) =>
                            this.loadContent(collectionID, name, type)
                        }
                        importCollection={collectionID => this.queueCollection(collectionID)}
                    />
                </div>
                <div
                    className="resizer"
                    onMouseDown={e => document.addEventListener('mousemove', this.resize)}
                    onMouseUp={e => {
                        document.removeEventListener('mousemove', this.resize);

                        // save the current width so it can be saved when the app
                        // closes
                        this.setState({
                            sidebarState: { ...this.state.sidebarState, width: e.clientX }
                        });
                    }}
                />
                <div className="docs-col">
                    <Tab
                        tabs={tabs}
                        contentSelected={contentSelected}
                        collections={collections}
                        importCollection={collectionID => this.queueCollection(collectionID)}
                    />
                </div>
            </div>
        );
    }

    private resize = e => {
        this.navRef.current.style.width = `${e.clientX}px`;
    };

    private loadContent(collectionID, name, type) {
        const collection = CollectionLoader.getCollection(collectionID);
        const tabID = this.state.contentSelected.tab;

        const content = CollectionLoader.getContent(collection, name, type);
        const newTabs = [...this.state.tabs];

        if (content.type === ViewType.plugin) {
            newTabs[tabID] = {
                view: ViewType.plugin,
                data: { plugin: content.data, collectionID: collectionID }
            };
        } else {
            newTabs[tabID] = {
                view: ViewType.html,
                data: { html: content.data, collectionID: collectionID }
            };
        }

        this.setState({ tabs: newTabs });
    }

    private toggleExpand(id) {
        const newSidebarState = { ...this.state.sidebarState };
        const expanded = newSidebarState.expandedIDs;

        const i = expanded.findIndex(x => x === id);
        if (i === -1) {
            expanded.push(id);
        } else {
            expanded.splice(i, 1);
        }

        this.setState({ sidebarState: newSidebarState }, () => {
            const { collections } = this.state;
            // If expanding a collection, and collection is open and collection is
            // loading, push the collection to the top of the import queue
            if (
                Object.keys(collections.byID).includes(id) &&
                this.state.sidebarState.expandedIDs.includes(id) &&
                collections.byID[id].status === ImportStatusType.loading
            ) {
                this.importQ.prioritize({ collectionID: id, path: collections.byID[id].path });
            }
        });
    }

    private loadQueuedImport(error, task) {
        const newCollections = { ...this.state.collections };

        if (error !== null) {
            newCollections.byID[task.collectionID].status = ImportStatusType.error;
        } else {
            const importResult = CollectionLoader.getCollection(task.collectionID);
            const index = CollectionLoader.getCollectionIndex(importResult.docs_blob);
            newCollections.byID[task.collectionID] = {
                ...newCollections.byID[task.collectionID],
                index: index,
                metadata: importResult.metadata,
                status: ImportStatusType.imported
            };
        }

        this.setState({ collections: newCollections });
    }

    private loadCollectionList() {
        const data = CollectionLoader.getCollectionList();

        for (const id in data.collections.byID) {
            if (!data.collections.byID[id].index) {
                this.importQ.push({ collectionID: id, path: data.collections.byID[id].path });
            }
        }

        this.setState({
            directories: data.directories,
            collections: data.collections,
            sidebarState: {
                ...this.state.sidebarState,
                expandedIDs: Object.keys(data.directories.byID)
            }
        });
    }

    private queueCollection(collectionID) {
        const collections = { ...this.state.collections };
        collections.byID[collectionID].status = ImportStatusType.loading;
        collections.byID[collectionID].metadata = null;
        collections.byID[collectionID].index = null;

        this.setState({ collections: collections }, () => {
            this.importQ.push({
                collectionID: collectionID,
                path: this.state.collections.byID[collectionID].path
            });
        });
    }

    private loadCollectionIndex(collectionID) {
        const data = CollectionLoader.getCollection(collectionID);
        const newCollections = { ...this.state.collections };
        newCollections.byID[collectionID].index = CollectionLoader.getCollectionIndex(
            data.docs_blob
        );
        this.setState({ collections: newCollections });
    }
}
