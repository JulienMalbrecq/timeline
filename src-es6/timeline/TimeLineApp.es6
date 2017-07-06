import OverlapResolver from './OverlapResolver';
import TimeLine from './TimeLine';
import TimeLineRenderer from './TimeLineRenderer';
import TimeLineToolbox from './TimeLineToolbox';
import * as DateUtils from '../lib/utils/Date';
import ProjectFactory from './data/Project';
import TimeSliceFactory from "./data/TimeSlice";
import MouseStateListener from '../lib/MouseStateListener';


    let App = function (wrapper, refDate) {
    this.wrapper = wrapper;
    this.refDate = refDate;

    this.eventManager = new EventsManager({private: true});

    this.overlapResolver = new OverlapResolver(this.eventManager);
    this.timeLine = new TimeLine(wrapper, refDate);
    this.renderer = new TimeLineRenderer(wrapper, refDate);

    this.toolBox = new TimeLineToolbox(timeLine);

    // add a data manager which will manage the loading and rendering of the timelines


};


var wrapper = document.getElementById('timeline'),
    refDate = DateUtils.toMidnight(new Date()),
    overlapResolver = new OverlapResolver(),
    timeLine = new TimeLine(wrapper, refDate),
    renderer = new TimeLineRenderer(wrapper, refDate),
    toolBox = new TimeLineToolbox(timeLine, new MouseStateListener(document.querySelector('html'))),
    itGroup = timeLine.addGroup('it'),
    moveTool = toolBox.createTool('move'),
    createTool = toolBox.createTool('create'),
    createButtons = document.querySelectorAll('[data-tool=create]'),
    moveButtons = document.querySelectorAll('[data-tool=move]'),
    b, tmp,
    playandgold = ProjectFactory.create('Play&Gold', '#FC0'),
    antargaz = ProjectFactory.create('Antargaz', '#0F0'),
    currentProject = playandgold,
    timeSlices = [];

itGroup.addLine('Julien');
itGroup.addLine('Brieuc');

createTool.mousedown = function (line, tile) {
    if (line === undefined) {
        return;
    }

    var date = timeLine.getDateFromTile(tile);
    tmp = TimeSliceFactory.create(currentProject, line.user, date, date);
    renderer.addSlice(tmp, line);
};

createTool.mousemove = function (line, tile) {
    var date = timeLine.getDateFromTile(tile);
    if (date >= tmp.startDate) {
        tmp.endDate = date;
    }

    renderer.refresh();
};

createTool.mouseup = function (line, tile) {
    var findOverlap = function (timeSlice) {
            return timeSlice.user === tmp.user && overlapResolver.isOverlapping(timeSlice, tmp);
        },
        sameProjectFilter = function (timeSlice) {
            return timeSlice.project === tmp.project;
        },
        overlapping = timeSlices.filter(findOverlap),
        sameProjectOverlapping = overlapping.filter(sameProjectFilter);

    if (overlapping.length > 0) {
        if (overlapping.length === sameProjectOverlapping.length) {
            overlapping.forEach(function (refSlice) {
                if (tmp.project === refSlice.project) {
                    overlapResolver.resolve(refSlice, tmp);
                    tmp.startDate = refSlice.startDate;
                    tmp.endDate = refSlice.endDate;
                }
            });

            renderer.refresh();
        }

        renderer.removeSlice(tmp);
        tmp = null;
    } else {
        timeSlices.push(tmp);
        renderer.refresh();
    }

};

for (b = 0; b < createButtons.length; b += 1) {
    toolBox.attachButton(createTool, createButtons[b]);
}

for (b = 0; b < moveButtons.length; b += 1) {
    toolBox.attachButton(moveTool, moveButtons[b]);
}