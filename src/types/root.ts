export enum ViewType {
    docs = 'docs',
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
    // plugin: any;
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

export class CollectionsType {
    byID: {
        [key: string]: {
            name: string;
            namespace: string;
            path: string;

            importedData?: any;

            // collections may or may not be loaded
            // metadata?: {};

            // should contents be a fk?
            // contents?: {};

            // no docs_blob in memory? That could be really inefficient
            // docs_blob?: {};
        };
    };
}

export class TabType {
    view: string;
    data: ImportViewType | PluginViewType | HTMLViewType | ErrorViewType;
}
