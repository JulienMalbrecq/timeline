import TimeLineContainer from './TimeLineContainer.es6';

import * as Data from './data/AbstractDataFactory.es6';
import {events} from "./data/TimeLineDataManager.es6";
import {resolutionType} from "./OverlapResolver.es6";
import * as Timeline from './TimeLine.es6';

import {TimeSlice} from './data/entity/TimeSlice.es6';
import TimeLineHeaderWidget from "./widget/TimeLineHeaderWidget.es6";
import UserLabelWidget from "./widget/UserLabelWidget.es6";
import {Config} from "../Config.es6";
import TimeLineStyleWidget from "./widget/TimeLineStyleWidget.es6";

class TimeLineApp {
    constructor () {
        this.container = new TimeLineContainer();

        this.eventManager = this.container.get('eventsManager');
        this.overlapResolver = this.container.get('overlapResolver');

        this.timeLine = this.container.get('timeLine');
        this.renderer = this.container.get('renderer');
        this.toolBox = this.container.get('toolbox');

        this.projects = [];

        this.init();
        this.initInterface();
    }

    initInterface() {
        let timeLineHeaderWidget = new TimeLineHeaderWidget(Config.startDate, Config.tileSize, Config.tilesPerDay, Config.daysToShow || 14);
        timeLineHeaderWidget.initInterface();

        let timeLineStyleWidget = new TimeLineStyleWidget(Config.startDate, Config.tileSize, Config.tilesPerDay);
        timeLineStyleWidget.initInterface();

        new UserLabelWidget(this.eventManager);
    }

    init() {
        // init interface after all data has been loaded
        let projectPromise = this.container.get('dataManager').getDataManager('project').findAll(),
            userPromise = this.container.get('dataManager').getDataManager('user').findAll();

        // @todo add timeslice loading to promise list

        Promise.all([projectPromise, userPromise]).then(results => {
            let entityBank = this.container.get('entityBank');

            entityBank.addBank('projects', results[0]);
            entityBank.addBank('users', results[1]);

            // init projects
            this.toolBox.initInterface();

            // init the timeline
            this.initTimeLine(entityBank.getBank('users'));
        });

        // events
        this.eventManager.bind(Timeline.events.SLICE_ADDED, slice => {
            this.renderer.initSlice(slice);
        });

        this.eventManager.bind(Timeline.events.SLICE_REMOVED, slice => {
            if (slice.element !== undefined) {
                slice.element = null;
            }
        });


        this.eventManager.bind(Data.events.POST_CREATE, timeSlice => {
            if (timeSlice && timeSlice instanceof TimeSlice) {
                this.timeLine.addSlice(timeSlice);
            }
        });

        this.eventManager.bind(Data.events.CHANGED, timeSlice => {
            if (timeSlice && timeSlice instanceof TimeSlice && timeSlice.changed) {
                this.renderer.render(this.timeLine.slices);
            }
        });

        this.eventManager.bind(events.POST_REMOVE, timeSlice => {
            if (timeSlice && timeSlice instanceof TimeSlice) {
                this.timeLine.removeSlice(timeSlice);
            }
        });

        this.eventManager.bind([events.PRE_PERSIST, events.PRE_UPDATE], event => {
            if (event.resource instanceof TimeSlice) {
                this.handleNewTimeSliceEvent(event);
            }
        });
    }

    initTimeLine (users) {
        let groups = [];

        // group by group
        users.forEach(user => {
            let userGroup = groups.find(group => group.name === user.group);
            if (!userGroup) {
                userGroup = {name: user.group, users: []};
                groups.push(userGroup);
            }

            userGroup.users.push(user);
        });

        groups.forEach(group => {
            let tlGroup = this.timeLine.addGroup(group.name);
            group.users.forEach(user => tlGroup.addLine(user));
        });
    }

    handleNewTimeSliceEvent (event) {
        let newSlice = event.resource,
            line = newSlice.line,
            resolveResponse,
            updated = [],
            timeSliceManager = this.container.get('dataManager').getDataManager('timeslice'),
            overlapping = this.timeLine.slices.filter(refSlice =>
                refSlice !== newSlice
                && refSlice.line === newSlice.line
                && this.overlapResolver.isOverlapping(refSlice, newSlice)
            ),
            sameProjectOverlapping = overlapping.filter(refSlice => newSlice.project === refSlice.project);

        // check if there is overlap
        if (overlapping.length > 0) {
            // check that all overlaps are of the same project
            if (overlapping.length === sameProjectOverlapping.length) {
                overlapping.forEach(refSlice => {
                    resolveResponse = this.overlapResolver.resolve(refSlice, newSlice);
                    if (resolveResponse !== null) {
                        // after a resolution, newSlice can be discarded
                        this.timeLine.removeSlice(newSlice);

                        // update refSlice
                        updated.push(refSlice);

                        if (false === newSlice.isTemp) {
                            let index = updated.findIndex(updateSlice => updateSlice === newSlice);
                            // remove from updated
                            if (index >= 0) {
                                updated.splice(index, 1);
                            }

                            // remove from server
                            timeSliceManager.remove(newSlice);
                        }

                        if (resolveResponse.type !== resolutionType.RESOLUTION_WITHIN) {
                            newSlice = refSlice; // swap refSlice and newSlice and continue resolution
                            event.canceled = true;
                        }
                    }
                });
            } else {
                event.canceled = true;
            }
        }

        // commit to server all updated slices
        updated.forEach(updatedSlice => timeSliceManager.update(updatedSlice));

        this.renderer.render(this.timeLine.slices);
    }
}

let timeline = new TimeLineApp();
