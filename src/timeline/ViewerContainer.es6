import EventsManager from "../lib/EventsManager.es6";
import TimeLine from "./TimeLine.es6";
import TimeLineRenderer from "./TimeLineRenderer.es6";
import MouseStateListener from "../lib/MouseStateListener.es6";
import TimeLineDataManager from "./data/TimeLineDataManager.es6";
import ProjectDataManager from "./data/dataManager/ProjectDataManager.es6";
import TimeSliceDataManager from "./data/dataManager/TimeSliceDataManager.es6";
import {TimeSliceFactory} from "./data/entity/TimeSlice.es6";
import ProjectFactory from "./data/entity/Project.es6";
import UserFactory from "./data/entity/User.es6";
import UserDataManager from "./data/dataManager/UserDataManager.es6";
import {Config} from "../Config.es6";
import TimeLineEntityBank from "./TimeLineEntityBank.es6";
import {Container, DependencyResolver} from "../lib/Container.es6";

let container = new Container();

// utils
container.addService('eventsManager', new DependencyResolver(() =>
    new EventsManager({private: true})
));

container.addService('entityBank', new DependencyResolver(() =>
    new TimeLineEntityBank()
));

container.addService('mouseListener', new DependencyResolver(() =>
    new MouseStateListener(document.querySelector('html'))
));

container.addService('timeSliceFactory', new DependencyResolver(() =>
    new TimeSliceFactory(container.get('entityBank'), container.get('eventsManager'))
));

container.addService('projectFactory', new DependencyResolver(() =>
    new ProjectFactory(container.get('eventsManager'))
));

container.addService('userFactory', new DependencyResolver(() =>
    new UserFactory(container.get('eventsManager'))
));

container.addService('dataManager', new DependencyResolver(() => {
    let dataManager = new TimeLineDataManager();

    let managers = [
        { manager: ProjectDataManager   , factory: container.get('projectFactory') },
        { manager: TimeSliceDataManager , factory: container.get('timeSliceFactory') },
        { manager: UserDataManager      , factory: container.get('userFactory') }
    ];

    managers.forEach(entry => dataManager.addDataManager(new entry.manager(container.get('eventsManager'), entry.factory)));

    return dataManager;
}));

container.addService('timeLine', new DependencyResolver(() =>
    new TimeLine(Config.mainWrapper, Config.startDate, container.get('eventsManager'))
));

container.addService('renderer', new DependencyResolver(() =>
    new TimeLineRenderer(Config.mainWrapper, Config.startDate)
));

export default container;