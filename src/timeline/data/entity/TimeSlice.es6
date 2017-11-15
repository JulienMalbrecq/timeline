import ManagedEntity from "../ManagedEntity.es6";
import {AbstractDataFactory, events} from "../AbstractDataFactory.es6";
import {Project} from "./Project.es6";
import {Line} from "../../TimeLine.es6";

export class TimeSlice extends ManagedEntity {
    constructor (project, line, startDate, endDate, isTemp = true, changed = true) {
        super();

        this._project = project;
        this._line = line;
        this._startDate = startDate;
        this._endDate = endDate;

        this._isTemp = isTemp;
        this._changed = changed;

        this._element = null;

        this.eventsManager = null;
    }

    containsDate (date) {
        return this._startDate <= date && this._endDate >= date;
    }

    get duration () {
        return this._endDate - this._startDate;
    }

    get element   () { return this._element; }
    get project   () { return this._project; }
    get line      () { return this._line; }
    get startDate () { return this._startDate; }
    get endDate   () { return this._endDate; }
    get isTemp    () { return this._isTemp; }
    get changed   () { return this._changed; }

    set element   (element) {
        if (element !== null) {
            this._line.wrapper.querySelector('.time').appendChild(element);
        } else if (this._element) {
            this._element.parentNode.removeChild(this._element);
        }

        this._element = element;
    }

    set project   (project) { this._project = project; this.changed = true; }
    set line      (line) { this._line = line; this.changed = true; }
    set startDate (startDate) { this._startDate = startDate; this.changed = true; }
    set endDate   (endDate) { this._endDate = endDate; this.changed = true; }
    set isTemp    (isTemp) { this._isTemp = isTemp; this.changed = true; }

    set changed (changed) {
        this._changed = changed;

        if (this.eventsManager) {
            this.eventsManager.fireEvent(events.CHANGED, this);
        }
    }
}

export class TimeSliceFactory extends AbstractDataFactory {
    constructor(entityBank, eventsManager) {
        super(eventsManager);
        this.entityBank = entityBank;
    }

    createEntity(project, line, startDate, endDate, ...options) {
        if (false === project instanceof Project) {
            project = this.entityBank.getFromBank('projects', project);
        }

        if (false === line instanceof Line) {
            console.log(line);
            line = this.entityBank.getFromBank('users', line).timeLine;
        }

        // transform dates
        startDate = new Date(startDate);
        endDate = new Date(endDate);

        let timeSlice = new TimeSlice(project, line, startDate, endDate, ...options);
        timeSlice.eventsManager = this.eventsManager;
        return timeSlice;
    }
}
