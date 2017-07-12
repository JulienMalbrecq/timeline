import {events} from "./TimeLineDataManager.es6";
import fermata from "fermata";

let resourceServer = fermata.json(config.resourceServer);

export default class AbstractDataManager {
    constructor  (resourceName, eventsManager) {
        this.resourceName = resourceName;
        this.resourceServer = resourceServer[resourceName];
        this.eventsManager = eventsManager;
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

    persist(resource) {
        let event = {resource, shouldPersist: true};
        this.eventsManager.fireEvent(events.PRE_PERSIST, event);

        if (event.shouldPersist) {
            resource.isTemp = false;
            // @todo save to server, then fire following event
            this.eventsManager.fireEvent(events.POST_PERSIST, resource);
        } else {
            console.log('should not persist', resource);
        }
    }

    remove (resource) {
        // @todo
        console.log('removing', resource);
    }

    parseData (data) {
        return data;
    }
}
