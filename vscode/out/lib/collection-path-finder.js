"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionPathFinder = void 0;
const child_process_1 = require("child_process");
const fs = require("fs");
const os = require("os");
const Path = require("path");
class CollectionPathFinder {
    static getPaths() {
        const files = [];
        const reg = new RegExp(/'(.*?)'/g);
        const lines = child_process_1.execSync('ansible-config dump')
            .toString()
            .split('\n');
        for (const line of lines) {
            if (line.startsWith('COLLECTIONS_PATHS')) {
                for (const file of line.match(reg)) {
                    files.push(file.replace(/'/g, ''));
                }
            }
        }
        return this.parsePaths(files);
    }
    static parsePaths(paths) {
        const out = [];
        for (let path of paths) {
            if (path.startsWith('~')) {
                path = Path.join(os.homedir(), path.substring(1));
            }
            if (fs.existsSync(path) && fs.statSync(path).isDirectory()) {
                const files = fs.readdirSync(path);
                if (files.includes('ansible_collections')) {
                    out.push(Path.join(path, 'ansible_collections'));
                }
                else {
                    out.push(path);
                }
            }
        }
        return out;
    }
}
exports.CollectionPathFinder = CollectionPathFinder;
// export function getCollectionPaths(): Promise<string[]> {
//   return new Promise((resolve, reject) => {
//     const reg = new RegExp(/'(.*?)'/g);
//
//     const p = spawn('ansible-config', ['dump']);
//     const allOut = [];
//
//     p.stdout.on('data', data => {
//       allOut.push(data);
//     });
//     p.on('exit', code => {
//       if (code === 0) {
//         const files = [];
//         const lines = allOut.join().split('\n');
//         for (const line of lines) {
//           if (line.startsWith('COLLECTIONS_PATHS')) {
//             for (const file of line.match(reg)) {
//               files.push(file.replace("'", ''));
//             }
//           }
//         }
//         resolve(files);
//       } else {
//         reject(code);
//       }
//     });
//   });
// }
//# sourceMappingURL=collection-path-finder.js.map