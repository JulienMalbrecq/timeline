export default class TimeLineDataManager {
    constructor () {
        this.dataManagers = [];
    }

    addDataManager (dataManager) {
        this.dataManagers.push(dataManager);
    }

    getDataManager(resourceName) {
        return this.dataManagers.find(manager => manager.resourceName === resourceName);
    }
}

export const events = {
    PRE_PERSIST : "data-manager-pre-persist",
    POST_PERSIST : "data-manager-post-persist",
    PRE_REMOVE : "data-manager-pre-remove",
    POST_REMOVE : "data-manager-post-remove",
    PRE_UPDATE : "data-manager-pre-update",
    POST_UPDATE : "data-manager-post-update"
};