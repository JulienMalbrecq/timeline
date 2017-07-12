import EventsManager from "../lib/EventsManager.es6";
import OverlapResolver from "./OverlapResolver.es6";
import TimeLine from "./TimeLine.es6";
import TimeLineRenderer from "./TimeLineRenderer.es6";
import TimeLineToolbox from "./TimeLineToolbox.es6";
import MouseStateListener from "../lib/MouseStateListener.es6";
import CreateTool from "./tool/CreateTool.es6";
import TimeLineDataManager from "./data/TimeLineDataManager.es6";
import ProjectDataManager from "./data/ProjectDataManager.es6";
import TimeSliceDataManager from "./data/TimeSliceDataManager.es6";
import {TimeSliceFactory} from "./data/TimeSlice.es6";

export default class TimeLineContainer {
    constructor(options) {
        this._services = {};
        this._options = options;
        this.init();
    }

    init() {
        // utils
        this._services.eventsManager = new EventsManager({private: true});
        this._services.mouseListener = new MouseStateListener(document.querySelector('html'));

        // data layer
        this._services.dataManager = new TimeLineDataManager();
        this._services.dataManager.addDataManager(new ProjectDataManager(this._services.eventsManager));
        this._services.dataManager.addDataManager(new TimeSliceDataManager(this._services.eventsManager));

        // tiles
        this._services.overlapResolver = new OverlapResolver(this._services.eventsManager);
        this._services.timeLine = new TimeLine(this._options.wrapper, this._options.refDate);
        this._services.renderer = new TimeLineRenderer(this._options.wrapper, this._options.refDate);
        this._services.timeSliceFactory = new TimeSliceFactory(this._services.eventsManager);

        // tools
        this._services.toolbox = new TimeLineToolbox(this._services.timeLine, this._services.mouseListener);


        this._services.tools = {
            create : new CreateTool(
                this._services.timeLine,
                this._services.timeSliceFactory,
                this._services.dataManager.getDataManager('timeslice'),
                this._services.dataManager.getDataManager('project')
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