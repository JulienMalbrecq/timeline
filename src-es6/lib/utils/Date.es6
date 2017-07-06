export const INTERVAL = {
    ONEMINUTE: 60000,
    ONEHOUR: 3600000,
    ONEDAY: 86400000
};

export var setHour =function(date, hour, minutes = 0, seconds = 0, milliseconds = 0) {
    date.setHours(hour);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    date.setMilliseconds(milliseconds);

    return date;
};

export var toMidnight = function (date) {
    return DateUtils.setHour(date, 0);
};

export var tileFromDate = function (date, refDate, startHour, tilePerDay) {
    let startOfDay = setHour(new Date(date.getTime()), startHour),
        timeDiff = date.getTime() - refDate.getTime(),
        days = Math.floor(timeDiff/INTERVAL.ONEDAY);

    return days * tilePerDay + Math.floor((date.getTime() - startOfDay.getTime()) / INTERVAL.ONEHOUR);
};
