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
    SearchViewType
} from '../../../types';
import { CollectionDocs, Search } from '../../components';

interface IProps {
    tabs: TabsType;
    contentSelected: any;
    collections: CollectionsType;
    importCollection: (collectionID) => void;
    updateTab: (id, newContent: TabType) => void;
    loadContent: (collectionID, name, type) => void;
}

export class Tab extends React.Component<IProps, {}> {
    render() {
        const {
            contentSelected,
            tabs,
            collections,
            importCollection,
            updateTab,
            loadContent
        } = this.props;

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
                                importCollection={collectionID => importCollection(collectionID)}
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
                                importCollection={collectionID => importCollection(collectionID)}
                                collections={collections}
                            />
                        </div>
                    </div>
                );

            // case ViewType.load:
            //     collection = collections.byID[currentTab.data.collectionID];
            //
            //     return (
            //         <div>
            //             <Button onClick={() => importCollection(currentTab.data.collectionID)}>
            //                 Load {collection.namespace}.{collection.name}
            //             </Button>
            //         </div>
            //     );
            // case ViewType.loading:
            //     return <div>Loading collection</div>;
            // case ViewType.error:
            //     return <div>Error loading colleciton</div>;
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
            default:
                return null;
        }
    }
}
