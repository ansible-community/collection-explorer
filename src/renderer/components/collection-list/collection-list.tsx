import * as React from 'react';
import './collection-list.scss';

import { DirectoriesType, CollectionsType } from '../../../types';

interface IProps {
    directories: DirectoriesType;
    collections: CollectionsType;
    selectCollection: (collectionID: string) => void;
}

export class CollectionList extends React.Component<IProps, {}> {
    render() {
        const { directories, collections } = this.props;
        return (
            <div className="pf-c-content collection-list">
                Collections
                <ul>
                    {Object.keys(directories.byID).map((v, i) => (
                        <li key={i}>
                            {directories.byID[v].path}
                            <ul>
                                {directories.byID[v].collectionIDs.map((x, j) => (
                                    <li style={{ cursor: 'pointer' }} key={j}>
                                        <a onClick={() => this.props.selectCollection(x)}>
                                            {collections.byID[x].namespace}.
                                            {collections.byID[x].name}
                                        </a>
                                    </li>
                                ))}
                                {directories.byID[v].collectionIDs.length === 0 && (
                                    <li>
                                        <i>No collections found</i>
                                    </li>
                                )}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
