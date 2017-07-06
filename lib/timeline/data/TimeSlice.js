"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TimeSlice = function TimeSlice(project, user, startDate, endDate) {
    _classCallCheck(this, TimeSlice);

    this.project = project;
    this.user = user;
    this.startDate = startDate;
    this.endDate = endDate;
};

var TimeSliceFactory = function () {
    function TimeSliceFactory() {
        _classCallCheck(this, TimeSliceFactory);
    }

    _createClass(TimeSliceFactory, null, [{
        key: "create",
        value: function create(project, user, startDate, endDate) {
            return new TimeSlice(project, user, startDate, endDate);
        }
    }]);

    return TimeSliceFactory;
}();

exports.default = TimeSliceFactory;