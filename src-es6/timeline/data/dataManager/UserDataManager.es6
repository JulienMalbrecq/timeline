import AbstractDataManager from "../AbstractDataManager.es6";

export default class UserDataManager extends AbstractDataManager {
    constructor (eventsManager) { super('user', eventsManager); }

    update(resource) {
        // do nothing
    }

    persist(resource) {
        // do nothing
    }

    remove(resource) {
        // do nothing
    }
}
