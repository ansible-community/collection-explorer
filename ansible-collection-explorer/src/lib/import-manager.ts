import { CollectionLoader } from '../lib';
import queue from 'async/queue';

import { StdOutType } from '../types';

class Task {
    collectionID: string;
    path: string;
}

export class ImportManager {
    q: any;
    callback: (err: any, task: any, out: StdOutType[]) => void;

    constructor(callback: (err: any, task: any, out: StdOutType[]) => void) {
        this.callback = callback;
        this.q = queue(this.importCollection, 1);
    }

    push(task: Task) {
        this.q.push(task, this.callback);
    }

    prioritize(task: Task) {
        this.q.remove(data => data.collectionID === task.collectionID);
        this.q.unshift(task, this.callback);
    }

    private async importCollection(
        task: Task,
        callback: (err: any, task: any, out: StdOutType[]) => void
    ) {
        const out: { type: 'stdout' | 'stderr'; message: string }[] = [];

        CollectionLoader.importCollection(task.path, task.collectionID, {
            onStandardErr: stdErr => out.push({ type: 'stderr', message: stdErr.toString() }),
            onStandardOut: stdOut => out.push({ type: 'stdout', message: stdOut.toString() })
        })
            .then(r => callback(null, task, out))
            .catch(r => callback('it broke', task, out));
    }
}
