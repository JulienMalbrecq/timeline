import AbstractDataManager from '../AbstractDataManager.es6';

export default class ProjectDataManager extends AbstractDataManager {
    constructor (entityManager, factory) {
        super('project', entityManager, factory);
    }
    //
    // findAll() {
    //     // @todo remove this method when backend is implemented
    //     return new Promise((resolve, reject) => {
    //         let data = this.parseData([
    //             {name: "Play&Gold", "color": "#FFCC00"},
    //             {name: "Antargaz", "color": "#00FF00"}
    //         ]);
    //         resolve(data);
    //     });
    // }

    parseData (data) {
        if (false === Array.isArray(data)) {
            data = [data];
        }

        return data.map(projectData => this.factory.create(projectData.name, projectData.color));
    }
}
