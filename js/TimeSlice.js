var TimeSliceFactory = (function () {
    var TimeSlice = function (project, startDate, endDate) {
            this.project = project;
            this.startDate = startDate;
            this.endDate = endDate;
        };

    TimeSlice.prototype = {};

    return {
        create : function (project, startDate, endDate) {
            return new TimeSlice(project, startDate, endDate);
        }
    };
})();