export const INTERVAL = {
    ONEMINUTE: 60000,
    ONEHOUR: 3600000,
    ONEDAY: 86400000
};

export let dateDiff = function (date, refDate, interval) {
    return Math.floor((date - refDate) / interval);
};

export let setHour = function(date, hour, minutes = 0, seconds = 0, milliseconds = 0) {
    date.setHours(hour);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    date.setMilliseconds(milliseconds);

    return date;
};

export let toMidnight = function (date) {
    return setHour(date, 0);
};

export let tileFromDate = function (date, refDate, startHour, tilePerDay) {
    let startOfDay = setHour(new Date(date), startHour);
    return dateDiff(date, refDate, INTERVAL.ONEDAY) * tilePerDay + dateDiff(date, startOfDay, INTERVAL.ONEHOUR);
};
