import * as React from 'react';

import { TextInput } from '@patternfly/react-core';

import { SearchViewType, CollectionsType, TabType, ViewType } from '../../../types';

interface IProps {
    tabID: string;
    data: SearchViewType;
    collections: CollectionsType;
    updateTab: (id, newContent: TabType) => void;
    loadContent: (collectionID, name, type) => void;
}

export class Search extends React.Component<IProps> {
    render() {
        const { collections, data, updateTab, tabID, loadContent } = this.props;
        const results: { name: string; collectionID: string; type: string }[] = [];

        if (data.keyword) {
            for (const key in collections.byID) {
                const index = collections.byID[key].index;
                if (index) {
                    for (const category in index) {
                        for (const content of index[category]) {
                            if (content.name.match(data.keyword)) {
                                results.push({
                                    name: content.name,
                                    collectionID: key,
                                    type: content.type
                                });
                            }
                        }
                    }
                }
            }
        }
        return (
            <div>
                <div>
                    <TextInput
                        aria-label="search"
                        value={data.keyword}
                        placeholder="Search for content..."
                        onChange={val =>
                            updateTab(tabID, {
                                view: ViewType.search,
                                name: 'Search',
                                data: { keyword: val }
                            })
                        }
                    />
                </div>
                <div className="pf-c-content">
                    <h3>Results</h3>
                    <ul>
                        {results.map((v, i) => (
                            <li key={i}>
                                <a onClick={() => loadContent(v.collectionID, v.name, v.type)}>
                                    {collections.byID[v.collectionID].namespace}.
                                    {collections.byID[v.collectionID].name}.{v.name} ({v.type})
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}
