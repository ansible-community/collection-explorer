"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateHelper = void 0;
const crypto = require("crypto");
// IDs for objects on the filesystem should be hashed paths. This makes them
// more reliable by standardizing the length and removing problematic characters
class StateHelper {
    static getID(path) {
        return crypto
            .createHash('md5')
            .update(path)
            .digest('hex');
    }
}
exports.StateHelper = StateHelper;
//# sourceMappingURL=state-helper.js.map