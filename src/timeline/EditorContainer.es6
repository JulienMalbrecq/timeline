import container from './ViewerContainer.es6';

import {DependencyResolver} from "../lib/Container.es6";
import OverlapResolver from "./OverlapResolver.es6";
import MoveTool from "./tool/MoveTool.es6";
import TimeLineToolbox from "./TimeLineToolbox.es6";
import CreateTool from "./tool/CreateTool.es6";
import DeleteTool from "./tool/DeleteTool.es6";

container.addService('overlapResolver', new DependencyResolver(() =>
    new OverlapResolver(container.get('eventsManager'))
));

container.addService('toolbox', new DependencyResolver(() => {
    let timeLine = container.get('timeLine'),
        timeSliceManager = container.get('dataManager').getDataManager('timeslice'),
        toolbox = new TimeLineToolbox(timeLine, container.get('mouseListener'));


    toolbox.addTool(
        new CreateTool(
            timeLine,
            container.get('timeSliceFactory'),
            container.get('entityBank'),
            timeSliceManager
        )
    );

    toolbox.addTool(
        new DeleteTool (timeLine, timeSliceManager)
    );

    toolbox.addTool(
        new MoveTool (timeLine, timeSliceManager)
    );

    return toolbox;
}));

export default container;