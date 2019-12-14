import { CollectionLoader } from '../lib';
import queue from 'async/queue';

export class ImportManager {
    q: any;
    callback: (err: any, task: any) => void;

    constructor(callback: (err: any, task: any) => void) {
        this.callback = callback;
        this.q = queue(this.importCollection, 1);
    }

    push(task) {
        this.q.push(task, this.callback);
    }

    prioritize(task) {
        this.q.remove(data => data.collectionID === task.collectionID);
        this.q.unshift(task, this.callback);
    }

    private async importCollection(task: { collectionID: string; path: string }, callback) {
        CollectionLoader.importCollection(task.path, task.collectionID, {
            // onStandardErr: error => console.error(`stderr: ${error.toString()}`)
        })
            .then(r => callback(null, task))
            .catch(r => callback('it broke', task));
    }
}
