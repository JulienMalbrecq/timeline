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

export let events = {
    PRE_PERSIST : "data-manager-pre-persist",
    POST_PERSIST : "data-manager-post-persist"
};