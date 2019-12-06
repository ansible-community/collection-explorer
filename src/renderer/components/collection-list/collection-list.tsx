import * as React from 'react';
import './collection-list.scss';

export class CollectionFileType {
    name: string;
    namespace: string;
    path: string;
}

export class DirectoryListType {
    path: string;
    collections: CollectionFileType[];
}

interface IProps {
    directories: DirectoryListType[];
    selectedCollection: CollectionFileType;
    selectCollection: (collection: CollectionFileType) => void;
}

export class CollectionList extends React.Component<IProps, {}> {
    render() {
        return (
            <div className="pf-c-content collection-list">
                Collections
                <ul>
                    {this.props.directories.map((v, i) => (
                        <li key={i}>
                            {v.path}
                            <ul>
                                {v.collections.map((x, j) => (
                                    <li style={{ cursor: 'pointer' }} key={j}>
                                        <a onClick={() => this.props.selectCollection(x)}>
                                            {x.namespace}.{x.name}
                                        </a>
                                    </li>
                                ))}
                                {v.collections.length === 0 && (
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
