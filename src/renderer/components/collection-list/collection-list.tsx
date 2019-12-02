import * as React from 'react';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

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
            <div className="pf-c-content">
                <ul>
                    {this.props.collectionList.map((v, i) => (
                        <li
                            style={{ cursor: 'pointer' }}
                            key={i}
                            onClick={() => this.props.selectCollection(v)}
                        >
                            {v.namespace}.{v.name}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
