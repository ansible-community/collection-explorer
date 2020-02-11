import * as React from 'react';
import './collection-list.scss';
import * as OS from 'os';

import {
    AngleRightIcon,
    AngleDownIcon,
    FolderIcon,
    SearchIcon,
    RedoIcon,
    ErrorCircleOIcon,
    PlusIcon,
    CogIcon
} from '@patternfly/react-icons';

import { Tooltip } from '@patternfly/react-core';

import { DirectoriesType, CollectionsType } from '../../../types';

interface IProps {
    directories: DirectoriesType;
    collections: CollectionsType;
    sidebarState: any;
    toggleExpand: (id) => void;
    loadContent: (collectionID, name, type) => void;
    importCollection: (id) => void;
    openSearch: () => void;
    loadCollectionList: () => void;
    loadImporterView: (id) => void;
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
        const {
            directories,
            collections,
            sidebarState,
            toggleExpand,
            openSearch,
            loadCollectionList,
            loadImporterView
        } = this.props;
        return (
            <div className="collection-nav">
                <div className="controls">
                    <div className="control" onClick={() => openSearch()}>
                        <div className="inner">
                            <CogIcon />
                        </div>
                    </div>
                    <div className="control" onClick={() => openSearch()}>
                        <div className="inner">
                            <PlusIcon />
                        </div>
                    </div>
                    <Tooltip position="bottom" content="Search Content" entryDelay={500}>
                        <div className="control" onClick={() => openSearch()}>
                            <div className="inner">
                                <SearchIcon />
                            </div>
                        </div>
                    </Tooltip>
                    <Tooltip position="bottom" content="Reload Collections" entryDelay={500}>
                        <div className="control" onClick={() => loadCollectionList()}>
                            <div className="inner">
                                <RedoIcon className="reload-icon" />
                            </div>
                        </div>
                    </Tooltip>
                </div>
                <div className="pf-c-content collection-list">
                    <div className="nav-container">
                        <ul>
                            {Object.keys(directories.byID).map((dirId, i) => (
                                <li key={i}>
                                    <Expander
                                        name={
                                            <span>
                                                <FolderIcon />{' '}
                                                {this.prettifyPath(directories.byID[dirId].path)}
                                            </span>
                                        }
                                        id={dirId}
                                        sidebarState={sidebarState}
                                        toggleExpand={id => toggleExpand(id)}
                                    >
                                        <ul>
                                            {directories.byID[dirId].collectionIDs.map((cId, j) => (
                                                <li style={{ cursor: 'pointer' }} key={j}>
                                                    {collections.byID[cId].status === 'error' ? (
                                                        <span>
                                                            <Tooltip content="View error">
                                                                <span
                                                                    style={{ color: 'red' }}
                                                                    onClick={() =>
                                                                        loadImporterView(cId)
                                                                    }
                                                                >
                                                                    <ErrorCircleOIcon />{' '}
                                                                </span>
                                                            </Tooltip>
                                                            {collections.byID[cId].namespace}.
                                                            {collections.byID[cId].name}{' '}
                                                        </span>
                                                    ) : (
                                                        <Expander
                                                            name={
                                                                <span>
                                                                    {
                                                                        collections.byID[cId]
                                                                            .namespace
                                                                    }
                                                                    .{collections.byID[cId].name}{' '}
                                                                    {collections.byID[cId]
                                                                        .metadata ? (
                                                                        <i>
                                                                            v
                                                                            {
                                                                                collections.byID[
                                                                                    cId
                                                                                ].metadata.version
                                                                            }
                                                                        </i>
                                                                    ) : null}
                                                                </span>
                                                            }
                                                            id={cId}
                                                            sidebarState={sidebarState}
                                                            toggleExpand={id => toggleExpand(id)}
                                                        >
                                                            {this.renderIndex(cId)}
                                                        </Expander>
                                                    )}
                                                </li>
                                            ))}
                                            {directories.byID[dirId].collectionIDs.length === 0 && (
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
            </div>
        );
    }

    renderIndex(collectionID) {
        const collection = this.props.collections.byID[collectionID];
        if (!collection.index) {
            if (collection.status === 'loading') {
                return (
                    <ul>
                        <li>
                            <i>Loading...</i>
                        </li>
                    </ul>
                );
            }

            return (
                <ul>
                    <li>Error loading collection</li>
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

    private prettifyPath(path: string) {
        const home = OS.homedir();

        if (path.startsWith(home)) {
            return `~${path.slice(home.length, path.length)}`;
        }

        return path;
    }
}
