import AbstractDataManager from './AbstractDataManager.es6';
import ProjectFactory from './Project.es6';

export default class ProjectDataManager extends AbstractDataManager {
    constructor () { super('project'); }
    parseData (data) {
        if (false === Array.isArray(data)) {
            data = [data];
        }

        return data.map(projectData => ProjectFactory.create(projectData.name, projectData.color));
    }
}
