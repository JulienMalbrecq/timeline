"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var INTERVAL = exports.INTERVAL = {
    ONEMINUTE: 60000,
    ONEHOUR: 3600000,
    ONEDAY: 86400000
};

var setHour = exports.setHour = function setHour(date, hour) {
    var minutes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var seconds = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var milliseconds = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    date.setHours(hour);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    date.setMilliseconds(milliseconds);

    return date;
};

var toMidnight = exports.toMidnight = function toMidnight(date) {
    return DateUtils.setHour(date, 0);
};

var tileFromDate = exports.tileFromDate = function tileFromDate(date, refDate, startHour, tilePerDay) {
    var startOfDay = setHour(new Date(date.getTime()), startHour),
        timeDiff = date.getTime() - refDate.getTime(),
        days = Math.floor(timeDiff / INTERVAL.ONEDAY);

    return days * tilePerDay + Math.floor((date.getTime() - startOfDay.getTime()) / INTERVAL.ONEHOUR);
};