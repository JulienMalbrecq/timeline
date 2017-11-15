import EventsManager from "../lib/EventsManager.es6";
import OverlapResolver from "./OverlapResolver.es6";
import TimeLine from "./TimeLine.es6";
import TimeLineRenderer from "./TimeLineRenderer.es6";
import MouseStateListener from "../lib/MouseStateListener.es6";
import TimeLineDataManager from "./data/TimeLineDataManager.es6";
import ProjectDataManager from "./data/dataManager/ProjectDataManager.es6";
import TimeSliceDataManager from "./data/dataManager/TimeSliceDataManager.es6";
import {TimeSliceFactory} from "./data/entity/TimeSlice.es6";
import TimeLineToolbox from "./TimeLineToolbox.es6";
import CreateTool from "./tool/CreateTool.es6";
import MoveTool from "./tool/MoveTool.es6";
import DeleteTool from "./tool/DeleteTool.es6";
import ProjectFactory from "./data/entity/Project.es6";
import UserFactory from "./data/entity/User.es6";
import UserDataManager from "./data/dataManager/UserDataManager.es6";
import {Config} from "../Config.es6";
import TimeLineEntityBank from "./TimeLineEntityBank.es6";

export default class TimeLineContainer {
    constructor() {
        this._services = {};
        this.init();
    }

    init() {
        // utils
        this._services.eventsManager = new EventsManager({private: true});
        this._services.entityBank = new TimeLineEntityBank();
        this._services.mouseListener = new MouseStateListener(document.querySelector('html'));

        // data layer
        //- factories
        this._services.timeSliceFactory = new TimeSliceFactory(this._services.entityBank, this._services.eventsManager);
        this._services.projectFactory = new ProjectFactory(this._services.eventsManager);
        this._services.userFactory = new UserFactory(this._services.eventsManager);

        this._services.dataManager = new TimeLineDataManager();

        let managers = [
            { manager: ProjectDataManager   , factory: this._services.projectFactory},
            { manager: TimeSliceDataManager , factory: this._services.timeSliceFactory},
            { manager: UserDataManager      , factory: this._services.userFactory}
        ];

        managers.forEach(entry => this._services.dataManager.addDataManager(new entry.manager(this._services.eventsManager, entry.factory)));

        // tiles
        this._services.overlapResolver = new OverlapResolver(this._services.eventsManager);
        this._services.timeLine = new TimeLine(Config.mainWrapper, Config.startDate, this._services.eventsManager);
        this._services.renderer = new TimeLineRenderer(Config.mainWrapper, Config.startDate);

        // tools
        this._services.toolbox = new TimeLineToolbox(this._services.timeLine, this._services.mouseListener);


        this._services.tools = {
            create : new CreateTool(
                this._services.timeLine,
                this._services.timeSliceFactory,
                this._services.entityBank,
                this._services.dataManager.getDataManager('timeslice')
            ),

            delete : new DeleteTool(
                this._services.timeLine,
                this._services.dataManager.getDataManager('timeslice')
            ),

            move : new MoveTool(
                this._services.timeLine,
                this._services.dataManager.getDataManager('timeslice')
            )
        };

        Object.keys(this._services.tools).forEach(toolName => this._services.toolbox.addTool(this._services.tools[toolName]));

    }

    get (serviceName) {
        if (false === serviceName in this._services){
            throw `Undefined service ${serviceName}`;
        }

        return this._services[serviceName];
    }
}