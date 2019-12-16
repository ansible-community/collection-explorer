import * as React from 'react';
import './root.scss';

import { CollectionLoader, ImportManager } from '../../lib';
import { Tab, Tabs, CollectionList } from '../components';

import {
    ViewType,
    TabType,
    DirectoriesType,
    CollectionsType,
    ImportStatusType,
    TabsType
} from '../../types';

interface IState {
    directories: DirectoriesType;
    collections: CollectionsType;
    contentSelected: {
        tab: string;
    };

    sidebarState: {
        width: number;
        expandedIDs: string[];
    };

    tabs: TabsType;
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
                tab: null
            },
            tabs: { byID: {} }
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
                    <Tabs
                        tabs={this.state.tabs}
                        removeTab={id => {
                            const newTabs = this.removeTab(id);
                            let newSelectedTab;
                            if (id === this.state.contentSelected.tab) {
                                newSelectedTab = Object.keys(newTabs.byID)[
                                    Object.keys(newTabs.byID).length - 1
                                ];
                            } else {
                                newSelectedTab = this.state.contentSelected.tab;
                            }
                            this.setState({
                                tabs: newTabs,
                                contentSelected: {
                                    ...this.state.contentSelected,
                                    tab: newSelectedTab
                                }
                            });
                        }}
                        selectedTab={this.state.contentSelected.tab}
                        setCurrentTab={tabID =>
                            this.setState({
                                contentSelected: { ...this.state.contentSelected, tab: tabID }
                            })
                        }
                    />
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

    private addTab(content: TabType): { tabs: TabsType; id: string } {
        // from https://stackoverflow.com/a/2117523
        function uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = (Math.random() * 16) | 0,
                    v = c == 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        }

        const newTabs = { ...this.state.tabs };
        const id = uuidv4();
        newTabs.byID[id] = content;
        return { tabs: newTabs, id: id };
    }

    private removeTab(id: string) {
        const newTabs = { ...this.state.tabs };
        delete newTabs.byID[id];
        return newTabs;
    }

    private updateTab(id: number, newContent: TabType) {
        const newTabs = { ...this.state.tabs };
        newTabs[id] = newContent;
        return newTabs;
    }

    private loadContent(collectionID, name, type) {
        const collection = this.state.collections.byID[collectionID];
        const tabName = `${collection.name}.${name}`;

        // TODO: find a better way to identify a tab by the content in it
        for (const key in this.state.tabs.byID) {
            if (this.state.tabs.byID[key].name === tabName) {
                this.setState({
                    contentSelected: { ...this.state.contentSelected, tab: key }
                });
                return;
            }
        }

        const importResult = CollectionLoader.getCollection(collectionID);
        const content = CollectionLoader.getContent(importResult, name, type);

        let newTab: TabType;

        if (content.type === ViewType.plugin) {
            newTab = {
                view: ViewType.plugin,
                name: tabName,
                data: { plugin: content.data, collectionID: collectionID }
            };
        } else {
            newTab = {
                view: ViewType.html,
                name: tabName,
                data: { html: content.data, collectionID: collectionID }
            };
        }

        const newTabs = this.addTab(newTab);
        this.setState({
            tabs: newTabs.tabs,
            contentSelected: { ...this.state.contentSelected, tab: newTabs.id }
        });
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
}
