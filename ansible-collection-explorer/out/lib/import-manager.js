"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportManager = void 0;
const lib_1 = require("../lib");
const queue_1 = require("async/queue");
class Task {
}
class ImportManager {
    constructor(callback) {
        this.callback = callback;
        this.q = queue_1.default(this.importCollection, 1);
    }
    push(task) {
        this.q.push(task, this.callback);
    }
    prioritize(task) {
        this.q.remove(data => data.collectionID === task.collectionID);
        this.q.unshift(task, this.callback);
    }
    importCollection(task, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const out = [];
            lib_1.CollectionLoader.importCollection(task.path, task.collectionID, {
                onStandardErr: stdErr => out.push({ type: 'stderr', message: stdErr.toString() }),
                onStandardOut: stdOut => out.push({ type: 'stdout', message: stdOut.toString() })
            })
                .then(r => callback(null, task, out))
                .catch(r => callback('it broke', task, out));
        });
    }
}
exports.ImportManager = ImportManager;
//# sourceMappingURL=import-manager.js.map