import {events} from "./TimeLineDataManager.es6";
import fermata from "fermata";
import {Config} from "../../Config.es6";

let resourceServer = fermata.json(Config.resourceServer);

export default class AbstractDataManager {
    constructor  (resourceName, eventsManager, factory) {
        this.resourceName = resourceName;
        this.resourceServer = resourceServer[resourceName];
        this.eventsManager = eventsManager;
        this.factory = factory;
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
        let event = {resource, canceled: false};
        this.eventsManager.fireEvent(events.PRE_UPDATE, event);

        if (false === event.canceled) {
            // @todo save to server, then fire following event
            console.log('updating', resource);
            this.eventsManager.fireEvent(events.POST_UPDATE, resource);
        } else {
            console.log('should not update', resource);
        }

        return !event.canceled;
    }

    persist(resource) {
        if (resource.id) {
            return this.update(resource);
        }

        let event = {resource, canceled: false};
        this.eventsManager.fireEvent(events.PRE_PERSIST, event);

        if (false === event.canceled) {
            resource.isTemp = false;
            // @todo save to server, then fire following event
            console.log('persisting', resource);
            resource.id = 1;
            this.eventsManager.fireEvent(events.POST_PERSIST, resource);

        } else {
            console.log('should not persist', resource);
        }

        return !event.canceled;
    }

    remove (resource) {
        this.eventsManager.fireEvent(events.PRE_REMOVE, resource);
        console.log('removing', resource);
        // @todo remove from server then fire following event
        this.eventsManager.fireEvent(events.POST_REMOVE, resource);
    }

    parseData (data) {
        throw `You should define a parseData method in class ${this.constructor.name}`;
    }
}
