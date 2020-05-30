import { spawn, execSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as Path from 'path';

export class CollectionPathFinder {
  static getPaths(): string[] {
    const files: string[] = [];
    const reg = new RegExp(/'(.*?)'/g);

    const lines = execSync('ansible-config dump')
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

  private static parsePaths(paths: string[]): string[] {
    const out = [];

    for (let path of paths) {
      if (path.startsWith('~')) {
        path = Path.join(os.homedir(), path.substring(1));
      }
      if (fs.existsSync(path) && fs.statSync(path).isDirectory()) {
        const files = fs.readdirSync(path);
        if (files.includes('ansible_collections')) {
          out.push(Path.join(path, 'ansible_collections'));
        } else {
          out.push(path);
        }
      }
    }

    return out;
  }
}

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
