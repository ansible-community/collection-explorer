import * as crypto from 'crypto';

// IDs for objects on the filesystem should be hashed paths. This makes them
// more reliable by standardizing the length and removing problematic characters
export class StateHelper {
    static getID(path: string) {
        return crypto
            .createHash('md5')
            .update(path)
            .digest('hex');
    }
}
