export default class TimeLineDataManager {
    constructor  (eventManager) {
        this.eventManager = eventManager;
    }

    load (serviceName, options, callback) {
        if (false === serviceName in config) {
            throw 'Unknown service ' + serviceName;
        }

        // use fermata here
    }
}
