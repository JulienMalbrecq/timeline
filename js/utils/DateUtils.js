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
    },

    tileFromDate: function (date, refDate, startHour, tilePerDay) {
        var startOfDay = DateUtils.setHour(new Date(date.getTime()), startHour),
            timeDiff = date.getTime() - refDate.getTime(),
            days = Math.floor(timeDiff/DateUtils.INTERVAL.ONEDAY);

        return days * tilePerDay + Math.floor((date.getTime() - startOfDay.getTime()) / DateUtils.INTERVAL.ONEHOUR);
    }
};