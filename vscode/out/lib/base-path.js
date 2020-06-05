"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBasePath = void 0;
const appRootDir = require("app-root-dir");
function getBasePath() {
    let rootDir = appRootDir.get();
    // the bundled app ends with /app.asar
    if (rootDir.endsWith('/app.asar')) {
        rootDir = rootDir.slice(0, -9);
    }
    return rootDir;
}
exports.getBasePath = getBasePath;
//# sourceMappingURL=base-path.js.map