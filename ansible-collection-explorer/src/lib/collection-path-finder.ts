import { spawn } from 'child_process';
export function getCollectionPaths(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reg = new RegExp(/'(.*?)'/g);

    const p = spawn('ansible-config', ['dump']);
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
      } else {
        reject(code);
      }
    });
  });
}
