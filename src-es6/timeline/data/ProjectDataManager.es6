import AbstractDataManager from './AbstractDataManager.es6';
import ProjectFactory from './Project.es6';

export default class ProjectDataManager extends AbstractDataManager {
    constructor () { super('project'); }

    findAll() {
        // @todo remove this method when backend is implemented
        return new Promise((resolve, reject) => {
            let data = this.parseData([
                {name: "Play&Gold", "color": "#FFCC00"},
                {name: "Antargaz", "color": "#00FF00"}
            ]);
            resolve(data);
        });
    }

    parseData (data) {
        if (false === Array.isArray(data)) {
            data = [data];
        }

        return data.map(projectData => ProjectFactory.create(projectData.name, projectData.color));
    }
}
