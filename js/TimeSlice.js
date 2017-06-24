var TimeSliceFactory = (function () {
    var TimeSlice = function (project, user, startDate, endDate) {
            this.project = project;
            this.user = user;
            this.startDate = startDate;
            this.endDate = endDate;
        };

    TimeSlice.prototype = {};

    return {
        create : function (project, user, startDate, endDate) {
            return new TimeSlice(project, user, startDate, endDate);
        }
    };
})();