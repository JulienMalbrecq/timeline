import * as Data from "./data/AbstractDataFactory.es6";
import * as Timeline from "./TimeLine.es6";
import TimeLineApp from "./TimeLineApp.es6";
import {events} from "./data/TimeLineDataManager.es6";
import {TimeSlice} from "./data/entity/TimeSlice.es6";
import {resolutionType} from "./OverlapResolver.es6";

export default class TimeLineEditorApp extends TimeLineApp {
    constructor(container) {
        super(container);

        this.overlapResolver = this.container.get('overlapResolver');
        this.toolBox = this.container.get('toolbox');

        this.initEvents();
    }

    initInterface () {
        super.initInterface();
        this.toolBox.initInterface();
    }

    initEvents () {
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

    handleNewTimeSliceEvent (event) {
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
    }
}