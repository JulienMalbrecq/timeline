var DateUtils = {
    INTERVAL: {
        ONEMINUTE: 60000,
        ONEHOUR: 3600000,
        ONEDAY: 86400000
    },

    setHour: function(date, hour, minutes, seconds, milliseconds) {
        minutes = minutes || 0;
        seconds = seconds || 0;
        milliseconds = milliseconds || 0;

        date.setHours(hour);
        date.setMinutes(minutes);
        date.setSeconds(seconds);
        date.setMilliseconds(milliseconds);

        return date;
    },

    toMidnight: function (date) {
        return DateUtils.setHour(date, 0);
    }
};