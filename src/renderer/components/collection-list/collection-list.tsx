import * as React from 'react';
import './collection-list.scss';

import { AngleRightIcon, AngleDownIcon, FolderIcon } from '@patternfly/react-icons';
import { Button } from '@patternfly/react-core';

import { DirectoriesType, CollectionsType } from '../../../types';

interface IProps {
    directories: DirectoriesType;
    collections: CollectionsType;
    sidebarState: any;
    toggleExpand: (id) => void;
    loadContent: (collectionID, name, type) => void;
    importCollection: (id) => void;
}

class Expander extends React.Component<{
    name: string | React.ReactElement;
    id: string;
    children: React.ReactElement;
    sidebarState: any;
    toggleExpand: (id) => void;
}> {
    render() {
        const { name, id, children, sidebarState, toggleExpand } = this.props;

        if (sidebarState.expandedIDs.includes(id)) {
            return (
                <React.Fragment>
                    <span style={{ cursor: 'pointer' }} onClick={() => toggleExpand(id)}>
                        <AngleDownIcon /> {name}
                    </span>
                    {children}
                </React.Fragment>
            );
        }
        return (
            <span style={{ cursor: 'pointer' }} onClick={() => toggleExpand(id)}>
                <AngleRightIcon /> {name}
            </span>
        );
    }
}

export class CollectionList extends React.Component<IProps, {}> {
    render() {
        const { directories, collections, sidebarState, toggleExpand } = this.props;
        return (
            <div className="pf-c-content collection-list">
                Collections
                <div className="nav-container">
                    <ul>
                        {Object.keys(directories.byID).map((v, i) => (
                            <li key={i}>
                                <Expander
                                    name={
                                        <span>
                                            <FolderIcon /> {directories.byID[v].path}
                                        </span>
                                    }
                                    id={v}
                                    sidebarState={sidebarState}
                                    toggleExpand={id => toggleExpand(id)}
                                >
                                    <ul>
                                        {directories.byID[v].collectionIDs.map((x, j) => (
                                            <li style={{ cursor: 'pointer' }} key={j}>
                                                <Expander
                                                    name={`${collections.byID[x].namespace}.${collections.byID[x].name}`}
                                                    id={x}
                                                    sidebarState={sidebarState}
                                                    toggleExpand={id => toggleExpand(id)}
                                                >
                                                    {this.renderIndex(x)}
                                                </Expander>
                                            </li>
                                        ))}
                                        {directories.byID[v].collectionIDs.length === 0 && (
                                            <li>
                                                <i>No collections found</i>
                                            </li>
                                        )}
                                    </ul>
                                </Expander>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    renderIndex(collectionID) {
        const collection = this.props.collections.byID[collectionID];
        if (!collection.index) {
            return (
                <ul>
                    <li>
                        <i>Collection not loaded</i>
                    </li>
                    <li>
                        <a onClick={() => this.props.importCollection(collectionID)}>
                            Load {collection.namespace}.{collection.name}
                        </a>
                    </li>
                </ul>
            );
        }

        const nodes = [];
        const index = collection.index;

        for (const k in index) {
            if (index[k].length === 0) {
                continue;
            }
            nodes.push(
                <li key={k}>
                    <Expander
                        name={
                            <span style={{ textTransform: 'capitalize' }}>
                                {k} ({index[k].length})
                            </span>
                        }
                        id={`${collectionID}${k}`}
                        sidebarState={this.props.sidebarState}
                        toggleExpand={id => this.props.toggleExpand(id)}
                    >
                        <ul>
                            {index[k].map((v, i) => (
                                <li key={i}>
                                    <a
                                        onClick={() =>
                                            this.props.loadContent(collectionID, v.name, v.type)
                                        }
                                    >
                                        {v.display}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </Expander>
                </li>
            );
        }

        return <ul>{nodes.map(v => v)}</ul>;
    }
}
