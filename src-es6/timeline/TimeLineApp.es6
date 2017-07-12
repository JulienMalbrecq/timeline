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
        // interface
        this.toolBox.initInterface();

        // events
        this.eventManager.bind(TimeSlice.events.POST_CREATE, timeSlice => {
            if (timeSlice) {
                this.renderer.addSlice(timeSlice);
            }
        });

        this.eventManager.bind(TimeSlice.events.CHANGED, timeSlice => {
            if (timeSlice && timeSlice.changed) {
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
                sameProjectOverlapping = overlapping.filter(refSlice => newSlice.project === refSlice.project);

            // check if there is overlap
            if (overlapping.length > 0) {
                this.renderer.removeSlice(newSlice); // stop rendering newSlice

                // check that all overlaps are of the same project
                if (overlapping.length === sameProjectOverlapping.length) {
                    overlapping.forEach(refSlice => {
                        resolveResponse = this.overlapResolver.resolve(refSlice, newSlice);
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
            b,
            playandgold = ProjectFactory.create('Play&Gold', '#FC0'),
            antargaz = ProjectFactory.create('Antargaz', '#0F0'),
            currentProject = playandgold,
            timeSlices = [];

        itGroup.addLine('Julien');
        itGroup.addLine('Brieuc');

        for (b = 0; b < createButtons.length; b += 1) {
            self.toolBox.attachButton(createButtons[b], createTool);
        }
    }
}

let timeline = new TimeLineApp(document.getElementById('timeline'), DateUtils.toMidnight(new Date()));