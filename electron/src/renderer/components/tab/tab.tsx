import * as React from 'react';
import { Button, Tooltip } from '@patternfly/react-core';
import { RedoIcon } from '@patternfly/react-icons';

import {
    TabsType,
    TabType,
    CollectionsType,
    ViewType,
    PluginViewType,
    HTMLViewType,
    SearchViewType,
    ImportViewType
} from '../../../types';
import { CollectionDocs, Search } from '../../components';

interface IProps {
    tabs: TabsType;
    contentSelected: any;
    collections: CollectionsType;
    updateTab: (id, newContent: TabType) => void;
    loadContent: (collectionID, name, type) => void;
}

export class Tab extends React.Component<IProps, {}> {
    render() {
        return <div>{this.renderTab()}</div>;
    }

    private renderTab() {
        const { contentSelected, tabs, collections, updateTab, loadContent } = this.props;

        if (
            Object.keys(tabs.byID).length === 0 ||
            !Object.keys(tabs.byID).includes(contentSelected.tab)
        ) {
            return null;
        }

        const currentTab = tabs.byID[contentSelected.tab];
        let collection;
        switch (currentTab.view) {
            case ViewType.plugin:
                collection = collections.byID[(currentTab.data as PluginViewType).collectionID];
                return (
                    <div>
                        <div>
                            <CollectionDocs
                                data={currentTab.data as PluginViewType}
                                view={currentTab.view}
                                collections={collections}
                            />
                        </div>
                    </div>
                );

            case ViewType.html:
                collection = collections.byID[(currentTab.data as HTMLViewType).collectionID];
                return (
                    <div>
                        <div>
                            <CollectionDocs
                                data={currentTab.data as HTMLViewType}
                                view={currentTab.view}
                                collections={collections}
                            />
                        </div>
                    </div>
                );
            case ViewType.search:
                return (
                    <Search
                        tabID={contentSelected.tab}
                        data={currentTab.data as SearchViewType}
                        collections={collections}
                        updateTab={(id, val) => updateTab(id, val)}
                        loadContent={(id, name, type) => loadContent(id, name, type)}
                    />
                );
            case ViewType.importer:
                collection = collections.byID[(currentTab.data as ImportViewType).collectionID];

                if (!collection.importerLog) {
                    return <div>No import results</div>;
                }
                return (
                    <div className="pf-c-content">
                        <h1>
                            Import log: {collection.namespace}.{collection.name}
                        </h1>
                        <div style={{ padding: '24px', overflowX: 'scroll' }}>
                            <pre>
                                {collection.importerLog.map((entry, i) => (
                                    <code
                                        style={entry.type === 'stderr' ? { color: 'red' } : {}}
                                        key={i}
                                    >
                                        {entry.message}
                                    </code>
                                ))}
                            </pre>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }
}
