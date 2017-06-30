var TimeLineDataManager = (function (config) {
    var TimeLineDataManager = function (eventManager) {
        this.eventManager = eventManager;
    };

    TimeLineDataManager.prototype = {
        load: function (serviceName, options, callback) {
            if (false === serviceName in config) {
                throw 'Unknown service ' + serviceName;
            }

            // use fermata here
        }
    };
})(MainConfig.services);