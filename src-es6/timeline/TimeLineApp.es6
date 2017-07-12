import * as DateUtils from '../lib/utils/Date.es6';

import TimeLineContainer from './TimeLineContainer.es6';

import ProjectFactory from './data/Project.es6';
import * as TimeSlice from './data/TimeSlice.es6';
import {events} from "./data/TimeLineDataManager.es6";
import {resolutionType} from "./OverlapResolver.es6";

class TimeLineApp {
    constructor (wrapper, refDate) {
        this.container = new TimeLineContainer({wrapper, refDate});

        this.wrapper = wrapper;
        this.refDate = refDate;
        this.slices = [];

        this.eventManager = this.container.get('eventsManager');
        this.overlapResolver = this.container.get('overlapResolver');

        this.timeLine = this.container.get('timeLine');
        this.renderer = this.container.get('renderer');
        this.toolBox = this.container.get('toolbox');

        // add a data manager which will manage the loading and rendering of the timelines

        this.init();
        this.tempInit();
    }

    init() {
        // events
        this.eventManager.bind(TimeSlice.events.POST_CREATE, timeSlice => {
            this.renderer.addSlice(timeSlice);
        });

        this.eventManager.bind(TimeSlice.events.CHANGED, timeSlice => {
            if (timeSlice.changed) {
                this.renderer.refresh();
            }
        });

        this.eventManager.bind(events.PRE_PERSIST, event => {
            let newSlice = event.resource,
                resolveResponse,
                overlapping = this.slices.filter(refSlice =>
                    refSlice.line === newSlice.line
                    && this.overlapResolver.isOverlapping(refSlice, newSlice)
                ),
                sameProjectOverlapping = overlapping.filter(refSlice => refSlice.project === refSlice.project);

            // check if there is overlap
            if (overlapping.length > 0) {
                this.renderer.removeSlice(newSlice); // stop rendering newSlice

                // check that all overlaps are of the same project
                console.log(overlapping.length === sameProjectOverlapping.length, overlapping.length, sameProjectOverlapping.length);
                if (overlapping.length === sameProjectOverlapping.length) {
                    overlapping.forEach(refSlice => {
                        resolveResponse = this.overlapResolver.resolve(refSlice, newSlice);
                        console.log(resolveResponse);
                        if (resolveResponse !== null) {
                            // after a resolution, newSlice can be discarded
                            this.renderer.removeSlice(newSlice);

                            if (false === newSlice.isTemp) {
                                // remove from server
                                console.log('should remove', newSlice);
                                this.container.get('dataManager').getDataManager('timeslice').remove(newSlice);
                            }

                            if (resolveResponse.type !== resolutionType.RESOLUTION_WITHIN) {
                                newSlice = refSlice;
                                event.shouldPersist = false;
                            }
                        }
                    });
                }
            } else {
                // no overlap, commit the newSlice
                this.slices.push(newSlice);
            }

            this.renderer.refresh();
        });
    }

    // temp
    tempInit() {
        let self = this,
            itGroup = this.timeLine.addGroup('it'),
            createTool = this.toolBox.getToolByName('create'),
            createButtons = document.querySelectorAll('[data-tool=create]'),
            b, tmp,
            playandgold = ProjectFactory.create('Play&Gold', '#FC0'),
            antargaz = ProjectFactory.create('Antargaz', '#0F0'),
            currentProject = playandgold,
            timeSlices = [];

        itGroup.addLine('Julien');
        itGroup.addLine('Brieuc');

        // createTool.mousedown = function (line, tile) {
        //     if (line === undefined) {
        //         return;
        //     }
        //
        //     var date = self.timeLine.getDateFromTile(tile);
        //     tmp = TimeSliceFactory.create(currentProject, line.user, date, date);
        //     self.renderer.addSlice(tmp, line);
        // };

        // createTool.mousemove = function (line, tile) {
        //     var date = self.timeLine.getDateFromTile(tile);
        //     if (date >= tmp.startDate) {
        //         tmp.endDate = date;
        //     }
        //
        //     self.renderer.refresh();
        // };

        // createTool.mouseup = function (line, tile) {
        //     var overlapping = timeSlices.filter(timeSlice => timeSlice.user === tmp.user && OverlapResolver.isOverlapping(timeSlice, tmp)),
        //         sameProjectOverlapping = overlapping.filter(timeSlice => timeSlice.project === tmp.project);
        //
        //     if (overlapping.length > 0) {
        //         if (overlapping.length === sameProjectOverlapping.length) {
        //             overlapping.forEach(refSlice => {
        //                 if (tmp.project === refSlice.project) {
        //                     self.overlapResolver.resolve(refSlice, tmp);
        //                     tmp.startDate = refSlice.startDate;
        //                     tmp.endDate = refSlice.endDate;
        //                 }
        //             });
        //
        //             self.renderer.refresh();
        //         }
        //
        //         self.renderer.removeSlice(tmp);
        //         tmp = null;
        //     } else {
        //         timeSlices.push(tmp);
        //         self.renderer.refresh();
        //     }
        //
        // };

        for (b = 0; b < createButtons.length; b += 1) {
            self.toolBox.attachButton(createButtons[b], createTool);
        }
    }
}

let timeline = new TimeLineApp(document.getElementById('timeline'), DateUtils.toMidnight(new Date()));