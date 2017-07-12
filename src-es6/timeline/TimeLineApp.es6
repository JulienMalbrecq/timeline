import * as DateUtils from '../lib/utils/Date.es6';

import TimeLineContainer from './TimeLineContainer.es6';

import * as Data from './data/AbstractDataFactory.es6';
import {events} from "./data/TimeLineDataManager.es6";
import {resolutionType} from "./OverlapResolver.es6";
import * as Timeline from './TimeLine.es6';

import {TimeSlice} from './data/entity/TimeSlice.es6';

class TimeLineApp {
    constructor (wrapper, refDate) {
        this.container = new TimeLineContainer({wrapper, refDate});

        this.wrapper = wrapper;
        this.refDate = refDate;

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
        // interface
        this.toolBox.initInterface();

        // events
        this.eventManager.bind(Timeline.events.SLICE_ADDED, slice => {
            this.renderer.initSlice(slice);
        });

        this.eventManager.bind(Timeline.events.SLICE_REMOVED, slice => {
            if (slice.element !== undefined) {
                this.renderer.wrapper.removeChild(slice.element);
            }
        });


        this.eventManager.bind(Data.events.POST_CREATE, timeSlice => {
            if (timeSlice) {
                this.timeLine.addSlice(timeSlice);
            }
        });

        this.eventManager.bind(Data.events.CHANGED, timeSlice => {
            if (timeSlice && timeSlice instanceof TimeSlice && timeSlice.changed) {
                this.renderer.render(this.timeLine.slices);
            }
        });

        this.eventManager.bind(events.POST_REMOVE, timeSlice => {
            if (timeSlice) {
                this.timeLine.removeSlice(timeSlice);
            }
        });

        this.eventManager.bind([events.PRE_PERSIST, events.PRE_UPDATE], event => {
            let newSlice = event.resource,
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
        });
    }

    // temp
    tempInit() {
        let itGroup = this.timeLine.addGroup('it');

        itGroup.addLine('Julien');
        itGroup.addLine('Brieuc');
    }
}

config.startDate = DateUtils.toMidnight(config.startDate);
let timeline = new TimeLineApp(document.getElementById('timeline'), config.startDate);