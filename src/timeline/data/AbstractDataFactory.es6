export class AbstractDataFactory {
    constructor(eventsManager) {
        this.eventsManager = eventsManager;
    }

    create(...options) {
        this.eventsManager.fireEvent(events.PRE_CREATE, options);
        let data = this.createEntity(...options);
        this.eventsManager.fireEvent(events.POST_CREATE, data);
        return data;
    }

    createEntity (...options) {
        throw `You should define a createEntity method in class ${this.constructor.name}`;
    }
}

export let events = {
    CHANGED: 'data-changed',
    PRE_CREATE: 'data-pre-create-event',
    POST_CREATE: 'data-post-create-event',
};

