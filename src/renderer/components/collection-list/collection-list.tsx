import * as React from 'react';
import './collection-list.scss';

export class CollectionFileType {
    name: string;
    namespace: string;
    path: string;
}

interface IProps {
    collectionList: CollectionFileType[];
    selectedCollection: CollectionFileType;
    selectCollection: (collection: CollectionFileType) => void;
}

export class CollectionList extends React.Component<IProps, {}> {
    render() {
        return (
            <div className="pf-c-content collection-list">
                Collections
                <ul>
                    {this.props.collectionList.map((v, i) => (
                        <li style={{ cursor: 'pointer' }} key={i}>
                            <a onClick={() => this.props.selectCollection(v)}>
                                {v.namespace}.{v.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
