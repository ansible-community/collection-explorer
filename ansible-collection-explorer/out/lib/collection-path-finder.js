"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollectionPaths = void 0;
const child_process_1 = require("child_process");
function getCollectionPaths() {
    return new Promise((resolve, reject) => {
        const reg = new RegExp(/'(.*?)'/g);
        const p = child_process_1.spawn('ansible-config', ['dump']);
        const allOut = [];
        p.stdout.on('data', data => {
            allOut.push(data);
        });
        p.on('exit', code => {
            if (code === 0) {
                const files = [];
                const lines = allOut.join().split('\n');
                for (const line of lines) {
                    if (line.startsWith('COLLECTIONS_PATHS')) {
                        for (const file of line.match(reg)) {
                            files.push(file.replace("'", ''));
                        }
                    }
                }
                resolve(files);
            }
            else {
                reject(code);
            }
        });
    });
}
exports.getCollectionPaths = getCollectionPaths;
//# sourceMappingURL=collection-path-finder.js.map