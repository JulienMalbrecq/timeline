import TimeLineDataManager from './TimeLineDataManager';
import ProjectFactory from './Project';

export default class ProjectDataManager extends TimeLineDataManager {
    parseData (data) {
        if (false === Array.isArray(data)) {
            data = [data];
        }

        return data.map(projectData => ProjectFactory.create(projectData.name, projectData.color));
    }
}