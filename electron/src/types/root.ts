export enum ViewType {
    plugin = 'plugin',
    html = 'html',
    search = 'search',
    importer = 'importer'
}

export class ImportViewType {
    collectionID: string;
}

class ContentViewBase {
    collectionID: string;
    contentName: string;
    contentType: string;
}

export class PluginViewType extends ContentViewBase {
    plugin: any;
}

export class HTMLViewType extends ContentViewBase {
    html: string;
}

export class SearchViewType {
    keyword: string;
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

export enum ImportStatusType {
    loading = 'loading',
    error = 'error',
    imported = 'imported'
}

export class StdOutType {
    type: 'stdout' | 'stderr';
    message: string;
}

export class CollectionType {
    name: string;
    namespace: string;
    path: string;

    // collections may or may not be loaded
    status?: ImportStatusType;
    index?: DocsIndexType;
    metadata?: any;
    importerLog?: StdOutType[];
}

export class CollectionsType {
    byID: {
        [key: string]: CollectionType;
    };
}

export class TabType {
    view: string;
    name: string;
    data: ImportViewType | PluginViewType | HTMLViewType | SearchViewType;
}

export class TabsType {
    byID: { [key: string]: TabType };
}
