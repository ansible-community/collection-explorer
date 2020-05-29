import * as appRootDir from 'app-root-dir';

export function getBasePath(): string {
    let rootDir = appRootDir.get();

    // the bundled app ends with /app.asar
    if (rootDir.endsWith('/app.asar')) {
        rootDir = rootDir.slice(0, -9);
    }

    return rootDir;
}
