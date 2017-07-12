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

    update (resource) {
        let event = {resource, shouldUpdate: true};
        this.eventsManager.fireEvent(events.PRE_UPDATE, event);

        if (event.shouldUpdate) {
            // @todo save to server, then fire following event
            console.log('updating', resource);
            this.eventsManager.fireEvent(events.POST_UPDATE, resource);
        } else {
            console.log('should not update', resource);
        }

        return event.shouldUpdate;
    }

    persist(resource) {
        let event = {resource, shouldPersist: true};
        this.eventsManager.fireEvent(events.PRE_PERSIST, event);

        if (event.shouldPersist) {
            resource.isTemp = false;
            // @todo save to server, then fire following event
            console.log('persisting', resource);
            this.eventsManager.fireEvent(events.POST_PERSIST, resource);

            return true;
        } else {
            console.log('should not persist', resource);
            return false;
        }
    }

    remove (resource) {
        this.eventsManager.fireEvent(events.PRE_REMOVE, resource);
        console.log('removing', resource);
        // @todo remove from server then throw following event
        this.eventsManager.fireEvent(events.POST_REMOVE, resource);
    }

    parseData (data) {
        return data;
    }
}
