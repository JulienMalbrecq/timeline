import {INTERVAL} from '../lib/utils/Date';

function getDaysFromTile(tile) {
    return Math.floor(tile / config.tilesPerDay);
}

function createTimeLineElement(line) {
    let element = document.createElement('div'),
        registerLineInEvent = function (ev) {
            ev.line = line;
        };

    element.addEventListener('mousedown', registerLineInEvent);
    element.addEventListener('mousemove', registerLineInEvent);
    element.addEventListener('mouseup', registerLineInEvent);
    element.setAttribute('data-timeline', line.user);
    return element;
}

class Line {
    constructor (startDate, user) {
        this.startDate = startDate;
        this.user = user;
    }
}

export default class TimeLine {
    constructor (wrapper, startDate) {
        this.wrapper = wrapper;
        this.startDate = startDate;
    }

    addGroup (name) {
        let fragment = document.createDocumentFragment(),
            wrapper = document.createElement('div'),
            lineWrapper = document.createElement('div'),
            titleElement = document.createElement('div'),
            group = new TimeLine(lineWrapper, this.startDate);

        wrapper.setAttribute('class', 'group-wrapper');
        lineWrapper.setAttribute('class', 'line-wrapper');

        titleElement.appendChild(document.createTextNode(name));
        wrapper.appendChild(titleElement);
        wrapper.appendChild(lineWrapper);
        fragment.appendChild(wrapper);

        this.wrapper.appendChild(fragment);

        return group;
    }

    addLine (user) {
        let line = new Line(this.startDate, user),
            element = createTimeLineElement(line);

        line.wrapper = element;
        this.wrapper.appendChild(element);
    }

    getDateFromTile (tile) {
        return new Date(this.startDate.getTime() + (INTERVAL.ONEDAY * getDaysFromTile(tile)) + (INTERVAL.ONEHOUR * (config.startHour + (tile % config.tilesPerDay))));
    }
}