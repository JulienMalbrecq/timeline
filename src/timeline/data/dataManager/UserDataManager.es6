import AbstractDataManager from "../AbstractDataManager.es6";

export default class UserDataManager extends AbstractDataManager {
    constructor (eventsManager, factory) { super('user', eventsManager, factory); }

    findAll() {
        // @todo remove this method when backend is implemented
        return new Promise((resolve, reject) => {
            let data = this.parseData([
                {id: 1, name: "Julien Malbrecq", group: "IT"},
                {id: 2, name: "Stephanie de Groote", group: "PM"},
                {id: 3, name: "Brieuc Barthelemy", group: "IT"}
            ]);
            resolve(data);
        });
    }


    update(resource) {
        // do nothing
    }

    persist(resource) {
        // do nothing
    }

    remove(resource) {
        // do nothing
    }


    parseData(data) {
        if (false === Array.isArray(data)) {
            data = [data];
        }

        return data.map(userData => this.factory.createEntity(userData));
    }
}
