import * as DateUtils from '../lib/utils/Date';
import EventsManager from '../lib/EventsManager';
import OverlapResolver from './OverlapResolver';
import TimeLine from './TimeLine';
import TimeLineRenderer from './TimeLineRenderer';
import TimeLineToolbox from './TimeLineToolbox';
import ProjectFactory from './data/Project';
import TimeSliceFactory from './data/TimeSlice';
import MouseStateListener from '../lib/MouseStateListener';

class TimeLineApp {
    constructor (wrapper, refDate) {
        this.wrapper = wrapper;
        this.refDate = refDate;

        this.eventManager = new EventsManager({private: true});

        this.overlapResolver = new OverlapResolver(this.eventManager);
        this.timeLine = new TimeLine(wrapper, refDate);
        this.renderer = new TimeLineRenderer(wrapper, refDate);

        TimeSliceFactory.eventsManager = this.eventManager;

        this.toolBox = new TimeLineToolbox(this.timeLine, new MouseStateListener(document.querySelector('html')));

        // add a data manager which will manage the loading and rendering of the timelines

        this.init();
    }

    // temp
    init() {
        let self = this,
            itGroup = this.timeLine.addGroup('it'),
            moveTool = this.toolBox.createTool('move'),
            createTool = this.toolBox.createTool('create'),
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

            var date = self.timeLine.getDateFromTile(tile);
            tmp = TimeSliceFactory.create(currentProject, line.user, date, date);
            self.renderer.addSlice(tmp, line);
        };

        createTool.mousemove = function (line, tile) {
            var date = self.timeLine.getDateFromTile(tile);
            if (date >= tmp.startDate) {
                tmp.endDate = date;
            }

            self.renderer.refresh();
        };

        createTool.mouseup = function (line, tile) {
            var overlapping = timeSlices.filter(timeSlice => timeSlice.user === tmp.user && OverlapResolver.isOverlapping(timeSlice, tmp)),
                sameProjectOverlapping = overlapping.filter(timeSlice => timeSlice.project === tmp.project);

            if (overlapping.length > 0) {
                if (overlapping.length === sameProjectOverlapping.length) {
                    overlapping.forEach(refSlice => {
                        if (tmp.project === refSlice.project) {
                            self.overlapResolver.resolve(refSlice, tmp);
                            tmp.startDate = refSlice.startDate;
                            tmp.endDate = refSlice.endDate;
                        }
                    });

                    self.renderer.refresh();
                }

                self.renderer.removeSlice(tmp);
                tmp = null;
            } else {
                timeSlices.push(tmp);
                self.renderer.refresh();
            }

        };

        for (b = 0; b < createButtons.length; b += 1) {
            self.toolBox.attachButton(createTool, createButtons[b]);
        }

        for (b = 0; b < moveButtons.length; b += 1) {
            self.toolBox.attachButton(moveTool, moveButtons[b]);
        }
    }
}

let timeline = new TimeLineApp(document.getElementById('timeline'), DateUtils.toMidnight(new Date()));