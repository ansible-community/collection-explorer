export enum View {
    docs = 'docs',
    load = 'load',
    loading = 'loading',
    error = 'error'
}

export class ErrorView {
    collectionID: string;
}

export class ImportView {
    // errorMessage: string;
    // importMessages: string;
    // status: string;
    collectionID: string;
}

export class PluginView {
    // plugin: any;
    collectionID: string;
}

export class HTMLView {
    html: string;
    collectionID: string;
}

export class Directories {
    byID: {
        [key: string]: {
            path: string;
            collectionIDs: string[];
        };
    };
}

export class Collections {
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
