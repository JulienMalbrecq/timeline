export class TimeSlice {
    constructor (project, user, startDate, endDate) {
        this._project = project;
        this._user = user;
        this._startDate = startDate;
        this._endDate = endDate;

        this.changed = true;
    }

    get project   () { return this._project; }
    get user      () { return this._user; }
    get startDate () { return this._startDate; }
    get endDate   () { return this._endDate; }

    set project   (project) { this._project = project; }
    set user      (user) { this._user = user; }
    set startDate (startDate) { this._startDate = project; }
    set endDate   (endDate) { this._project = project; }
}

export default class TimeSliceFactory {
    static create(project, user, startDate, endDate) {
        if (TimeSliceFactory.eventsManager) {
            let preEvent = {project, user, startDate, endDate};
            TimeSliceFactory.eventsManager.fireEvent(events.PRE_CREATE, preEvent);
            var {project, user, startDate, endDate} = preEvent;
        }

        let timeSlice = new TimeSlice(project, user, startDate, endDate);

        if (TimeSliceFactory.eventsManager) {
            let postEvent = timeSlice;
            TimeSliceFactory.eventsManager.fireEvent(events.POST_CREATE, postEvent);
            timeSlice = postEvent;
        }

        return timeSlice;
    }
}

export let events = {
    PRE_CREATE: 'timeslice-pre-create-event',
    POST_CREATE: 'timeslice-post-create-event',
};

TimeSliceFactory.eventsManager = null;