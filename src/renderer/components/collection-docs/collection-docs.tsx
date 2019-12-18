import * as React from 'react';
import './collection-docs.scss';
import Scrollchor from 'react-scrollchor';

import {
    EmptyState,
    EmptyStateBody,
    EmptyStateVariant,
    Title,
    EmptyStateIcon,
    Tooltip
} from '@patternfly/react-core';

import { WarningTriangleIcon } from '@patternfly/react-icons';
import { RenderPluginDoc, DocsNav } from 'ansible-doc-renderer';
import { RedoIcon } from '@patternfly/react-icons';

import { CollectionsType, HTMLViewType, PluginViewType, ViewType } from '../../../types';

interface IProps {
    data: HTMLViewType | PluginViewType;
    view: ViewType.plugin | ViewType.html;
    collections: CollectionsType;
}

// renders markdown files in collection docs/ directory
export class CollectionDocs extends React.Component<IProps> {
    docsRef: any;

    constructor(props) {
        super(props);
        this.docsRef = React.createRef();
    }

    render() {
        const { data, collections, view } = this.props;
        const collection = collections.byID[data.collectionID];

        return (
            <React.Fragment>
                <div className="docs-container">
                    <div className="body docs" ref={this.docsRef}>
                        <div className="collection-header">
                            <div className="pf-c-content">
                                <h1>
                                    {collection.namespace}.{collection.name}
                                </h1>
                            </div>
                        </div>

                        {view === ViewType.html ? (
                            <div
                                className="pf-c-content"
                                dangerouslySetInnerHTML={{
                                    __html: (data as HTMLViewType).html
                                }}
                            />
                        ) : (
                            <RenderPluginDoc
                                renderModuleLink={s => <span>{s}</span>}
                                renderDocLink={(s, s1) => <span>{s}</span>}
                                renderTableOfContentsLink={(title, section) => (
                                    <Scrollchor key={section} to={'#' + section}>
                                        {title}
                                    </Scrollchor>
                                )}
                                plugin={(data as PluginViewType).plugin}
                            />
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
    }

    private renderNotFound(collectionName) {
        return (
            <EmptyState className="empty" variant={EmptyStateVariant.full}>
                <EmptyStateIcon icon={WarningTriangleIcon} />
                <Title headingLevel="h2" size="lg">
                    Not found
                </Title>
                <EmptyStateBody>
                    The file you're looking for doesn't seem to be available in this version of{' '}
                    {collectionName}.
                </EmptyStateBody>
            </EmptyState>
        );
    }
}
