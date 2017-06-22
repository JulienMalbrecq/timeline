var TimeLine = (function (doc, config) {
    var ONEDAY = 86400000,
        ONEHOUR = 3600000,
        TimeLine = function (startDate, user) {
            this.startDate = startDate;
            this.user = user;

            this.timeSlices = [];
            this.element = createTimeLineElement(this);
        };

    function getDaysFromTile(tile) {
        return Math.floor(tile / config.slicesPerDay);
    }

    function getTileFromOffset(offset) {
        return Math.floor(offset / config.tileSize);
    }

    function getTileFromDate(date, refDate) {
        var startOfDay = new Date(date.getTime()),
            timeDiff = date.getTime() - refDate.getTime(),
            days = Math.floor(timeDiff/ONEDAY);

        startOfDay.setHours(config.startHour);
        startOfDay.setMinutes(0);
        startOfDay.setSeconds(0);
        startOfDay.setMilliseconds(0);

        return days * config.slicesPerDay + Math.floor((date.getTime() - startOfDay.getTime()) / ONEHOUR);
    }

    function getDateFromTile(refDate, tile) {
        return new Date(refDate.getTime() + (ONEDAY * getDaysFromTile(tile)) + (ONEHOUR * (config.startHour + (tile % config.slicesPerDay))));
    }

    function createTimeLineElement(timeLine) {
        var element = doc.createElement('div');
        element.addEventListener('mousedown', function (ev) {
            timeLine.startDrag(getTileFromOffset(ev.offsetX));
        });

        element.addEventListener('mouseup', function (ev) {
            timeLine.endDrag(getTileFromOffset(ev.offsetX));
        });

        element.setAttribute('data-timeline', timeLine.user);
        return element;
    }

    TimeLine.prototype = {
        startDrag: function (tile) {
            this.dragData = {
                startTile: tile
            }
        },

        endDrag: function (tile) {
            this.dragData.endTile = tile;
            this.resolveDragData(this.dragData);
        },

        resolveDragData: function (dragData) {
            console.log(this.user, 'start date: ', getDateFromTile(this.startDate, dragData.startTile));
            console.log(this.user, 'end date: ', getDateFromTile(this.startDate, dragData.endTile));
            console.log(this.user, 'reverse lookup of tile from end date', getTileFromDate(getDateFromTile(this.startDate, dragData.endTile), this.startDate));
        }
    };

    return TimeLine;
})(document, {startHour: 8, slicesPerDay: 8, tileSize: 20});