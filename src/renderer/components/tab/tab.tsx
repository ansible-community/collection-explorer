import * as React from 'react';
import { Button, Tooltip } from '@patternfly/react-core';
import { RedoIcon } from '@patternfly/react-icons';

import { TabsType, CollectionsType, ViewType, PluginViewType, HTMLViewType } from '../../../types';
import { CollectionDocs } from '../../components';

interface IProps {
    tabs: TabsType;
    contentSelected: any;
    collections: CollectionsType;
    importCollection: (collectionID) => void;
}

export class Tab extends React.Component<IProps, {}> {
    render() {
        const { contentSelected, tabs, collections, importCollection } = this.props;

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
                collection = collections.byID[currentTab.data.collectionID];
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
                collection = collections.byID[currentTab.data.collectionID];
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

            case ViewType.load:
                collection = collections.byID[currentTab.data.collectionID];

                return (
                    <div>
                        <Button onClick={() => importCollection(currentTab.data.collectionID)}>
                            Load {collection.namespace}.{collection.name}
                        </Button>
                    </div>
                );
            case ViewType.loading:
                return <div>Loading collection</div>;
            case ViewType.error:
                return <div>Error loading colleciton</div>;
            default:
                return null;
        }
    }
}
