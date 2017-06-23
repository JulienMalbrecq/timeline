var TimeLine = (function (doc, config) {
    var Line, TimeLine;

    function getDaysFromTile(tile) {
        return Math.floor(tile / config.slicesPerDay);
    }

    function getTileFromDate(date, refDate) {
        var startOfDay = DateUtils.setHour(new Date(date.getTime()), config.startHour),
            timeDiff = date.getTime() - refDate.getTime(),
            days = Math.floor(timeDiff/DateUtils.INTERVAL.ONEDAY);

        return days * config.slicesPerDay + Math.floor((date.getTime() - startOfDay.getTime()) / DateUtils.INTERVAL.ONEHOUR);
    }

    function getDateFromTile(refDate, tile) {
        return new Date(refDate.getTime() + (DateUtils.INTERVAL.ONEDAY * getDaysFromTile(tile)) + (DateUtils.INTERVAL.ONEHOUR * (config.startHour + (tile % config.slicesPerDay))));
    }

    function createTimeLineElement(line) {
        var element = doc.createElement('div'),
            registerLineInEvent = function (ev) {
                ev.line = line;
            };

        element.addEventListener('mousedown', registerLineInEvent);
        element.addEventListener('mousemove', registerLineInEvent);
        element.addEventListener('mouseup', registerLineInEvent);

        element.setAttribute('data-timeline', line.user);
        return element;
    }

    Line = function (startDate, user) {
        this.startDate = startDate;
        this.user = user;
    };

    Line.prototype = {
    };

    TimeLine = function (wrapper, startDate) {
        this.wrapper = wrapper;
        this.startDate = startDate;
    };

    TimeLine.prototype = {
        addGroup: function (name) {
            var fragment = doc.createDocumentFragment(),
                wrapper = doc.createElement('div'),
                lineWrapper = doc.createElement('div'),
                titleElement = doc.createElement('div'),
                group = new TimeLine(lineWrapper, this.startDate);

            wrapper.setAttribute('class', 'group-wrapper');
            lineWrapper.setAttribute('class', 'line-wrapper');

            titleElement.appendChild(doc.createTextNode(name));
            wrapper.appendChild(titleElement);
            wrapper.appendChild(lineWrapper);
            fragment.appendChild(wrapper);

            this.wrapper.appendChild(fragment);

            return group;
        },

        addLine: function (user) {
            var line = new Line(this.startDate, user),
                element = createTimeLineElement(line);

            this.wrapper.appendChild(element);
        }
    };

    return TimeLine;
})(document, {startHour: 8, slicesPerDay: 8, tileSize: 20});