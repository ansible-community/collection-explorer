import * as React from 'react';
import './collection-docs.scss';
import Scrollchor from 'react-scrollchor';

import {
    EmptyState,
    EmptyStateBody,
    EmptyStateVariant,
    Title,
    EmptyStateIcon
} from '@patternfly/react-core';

import { WarningTriangleIcon } from '@patternfly/react-icons';

import { RenderPluginDoc, DocsNav } from 'ansible-doc-renderer';

interface IState {
    selectedName: string;
    selectedType: string;
}

interface IProps {
    collection: any;
}

// renders markdown files in collection docs/ directory
export class CollectionDocs extends React.Component<IProps, IState> {
    docsRef: any;

    constructor(props) {
        super(props);

        this.state = {
            selectedName: '',
            selectedType: 'docs'
        };

        this.docsRef = React.createRef();
    }

    render() {
        const { selectedType, selectedName } = this.state;
        const { collection } = this.props;

        let displayHTML: string;
        let pluginData;

        if (selectedType === 'docs' && selectedName && selectedName !== 'readme') {
            if (collection.docs_blob.documentation_files) {
                const file = collection.docs_blob.documentation_files.find(
                    x => x.name === selectedName
                );

                if (file) {
                    displayHTML = file.html;
                }
            }
        } else if (selectedType !== 'docs' && selectedName) {
            // check if contents exists
            if (collection.docs_blob.contents) {
                const content = collection.docs_blob.contents.find(
                    x => x.content_type === selectedType && x.content_name === selectedName
                );

                if (content) {
                    if (selectedType === 'role') {
                        displayHTML = content['readme_html'];
                    } else {
                        pluginData = content;
                    }
                }
            }
        } else {
            if (collection.docs_blob.collection_readme) {
                displayHTML = collection.docs_blob.collection_readme.html;
            }
        }

        // scroll to top of page
        if (this.docsRef.current) {
            this.docsRef.current.scrollIntoView();
        }

        return (
            <React.Fragment>
                <div className="docs-container">
                    <DocsNav
                        className="sidebar"
                        namespace={collection.metadata.namespace}
                        collection={collection.metadata.name}
                        docs_blob={collection.docs_blob}
                        renderLink={entry => (
                            <a
                                onClick={() => {
                                    this.setState({
                                        selectedName: entry.name,
                                        selectedType: entry.type
                                    });
                                }}
                            >
                                {entry.display}
                            </a>
                        )}
                        selectedName={selectedName}
                        selectedType={selectedType}
                    />
                    <div className="body docs" ref={this.docsRef}>
                        {displayHTML || pluginData ? (
                            // if neither variable is set, render not found
                            displayHTML ? (
                                // if displayHTML is set, render it
                                <div
                                    className="pf-c-content"
                                    dangerouslySetInnerHTML={{
                                        __html: displayHTML
                                    }}
                                />
                            ) : (
                                // if plugin data is set render it
                                <RenderPluginDoc
                                    renderModuleLink={s => <span>{s}</span>}
                                    renderDocLink={(s, s1) => <span>{s}</span>}
                                    renderTableOfContentsLink={(title, section) => (
                                        <Scrollchor key={section} to={'#' + section}>
                                            {title}
                                        </Scrollchor>
                                    )}
                                    plugin={pluginData}
                                />
                            )
                        ) : (
                            this.renderNotFound(collection.metadata.name)
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
