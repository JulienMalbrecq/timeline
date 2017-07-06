class TimeSlice {
    constructor (project, user, startDate, endDate) {
        this.project = project;
        this.user = user;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

export default class TimeSliceFactory {
    static create(project, user, startDate, endDate) {
        return new TimeSlice(project, user, startDate, endDate);
    }
}
