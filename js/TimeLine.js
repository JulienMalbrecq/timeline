var TimeLine = (function (doc, config) {
    var Line, TimeLine;

    function getDaysFromTile(tile) {
        return Math.floor(tile / config.tilesPerDay);
    }

    function getTileFromDate(date, refDate) {
        var startOfDay = DateUtils.setHour(new Date(date.getTime()), config.startHour),
            timeDiff = date.getTime() - refDate.getTime(),
            days = Math.floor(timeDiff/DateUtils.INTERVAL.ONEDAY);

        return days * config.tilesPerDay + Math.floor((date.getTime() - startOfDay.getTime()) / DateUtils.INTERVAL.ONEHOUR);
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

            line.wrapper = element;

            this.wrapper.appendChild(element);
        },

        getDateFromTile: function (tile) {
            return new Date(this.startDate.getTime() + (DateUtils.INTERVAL.ONEDAY * getDaysFromTile(tile)) + (DateUtils.INTERVAL.ONEHOUR * (config.startHour + (tile % config.tilesPerDay))));
        }
    };

    return TimeLine;
})(document, MainConfig);