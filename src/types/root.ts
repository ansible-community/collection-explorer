export enum ViewType {
    plugin = 'plugin',
    html = 'html',
    load = 'load',
    loading = 'loading',
    error = 'error'
}

export class ErrorViewType {
    collectionID: string;
}

export class ImportViewType {
    // errorMessage: string;
    // importMessages: string;
    // status: string;
    collectionID: string;
}

export class PluginViewType {
    plugin: any;
    collectionID: string;
}

export class HTMLViewType {
    html: string;
    collectionID: string;
}

export class DirectoriesType {
    byID: {
        [key: string]: {
            path: string;
            collectionIDs: string[];
        };
    };
}

export class DocsEntryType {
    display: string;
    name: string;
    type: string;
}

export class DocsIndexType {
    documentation: DocsEntryType[];
    modules: DocsEntryType[];
    roles: DocsEntryType[];
    playbooks: DocsEntryType[];
    plugins: DocsEntryType[];
}

export class ImporterResultType {
    metadata: any;
    docs_blob: any;
    contents: any;
}

export class CollectionType {
    name: string;
    namespace: string;
    path: string;

    status?: 'loading' | 'error';

    index?: DocsIndexType;

    // collections may or may not be loaded
    metadata?: {};

    // no docs_blob in memory? That could be really inefficient
    // maybe just store plugin data in tab data
    // docs_blob?: {};
}

export class CollectionsType {
    byID: {
        [key: string]: CollectionType;
    };
}

export class TabType {
    view: string;
    data: ImportViewType | PluginViewType | HTMLViewType | ErrorViewType;
}
