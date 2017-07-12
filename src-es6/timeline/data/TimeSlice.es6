export class TimeSlice {
    constructor (project, line, startDate, endDate, isTemp = true, changed = true) {
        this._project = project;
        this._line = line;
        this._startDate = startDate;
        this._endDate = endDate;

        this._isTemp = isTemp;
        this._changed = changed;

        this._id = null;

        this.eventsManager = null;
    }

    containsDate (date) {
        return this._startDate <= date && this._endDate >= date;
    }

    get duration () {
        return this._endDate - this._startDate;
    }

    get id        () { return this._id; }
    get project   () { return this._project; }
    get line      () { return this._line; }
    get startDate () { return this._startDate; }
    get endDate   () { return this._endDate; }
    get isTemp    () { return this._isTemp; }
    get changed   () { return this._changed; }

    set id        (id) { this._id = id; }
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

export class TimeSliceFactory {
    constructor(eventsManager) {
        this.eventsManager = eventsManager;
    }

    create(project, line, startDate, endDate, ...options) {
        if (this.eventsManager) {
            let preEvent = {project, line, startDate, endDate};
            this.eventsManager.fireEvent(events.PRE_CREATE, preEvent);
            var {project, line, startDate, endDate} = preEvent;
        }

        let timeSlice = new TimeSlice(project, line, startDate, endDate, ...options);
        timeSlice.eventsManager = this.eventsManager;

        if (this.eventsManager) {
            let postEvent = timeSlice;
            this.eventsManager.fireEvent(events.POST_CREATE, postEvent);
            timeSlice = postEvent;
        }

        return timeSlice;
    }
}

export let events = {
    CHANGED: 'timeslice-changed',
    PRE_CREATE: 'timeslice-pre-create-event',
    POST_CREATE: 'timeslice-post-create-event',
};
