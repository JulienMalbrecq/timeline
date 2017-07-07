import fermata from 'fermata';

//let resourceServer = function () {};
let resourceServer = fermata.json(config.resourceServer);

export default class TimeLineDataManager {
    constructor  (resourceName, eventManager) {
        this.eventManager = eventManager;
        this.resourceServer = resourceServer[resourceName];
    }

    findAll() {
        return this.findBy();
    }

    find (id) {
        return this.findBy({id});
    }

    findBy (options = {}) {
        return new Promise((resolve, refuse) => {
            this.resourceServer(options).get((error, data) => {
                if (error) {
                    refuse(error);
                } else {
                    resolve(this.parseData(data))
                }});
        });
    }

    parseData (data) {
        return data;
    }
}
