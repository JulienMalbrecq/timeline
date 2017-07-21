import * as TileUtils from '../lib/utils/Tile.es6';
import * as CSS from "../lib/utils/CSS.es6";

function createTimeLineElement(line) {
    let lineWrapper = document.createElement('div'),
        labelElement = document.createElement('div'),
        element = document.createElement('div'),
        registerLineInEvent = function (ev) {
            ev.line = line;
        };

    CSS.addClass(labelElement, 'label');
    labelElement.appendChild(document.createTextNode(line.user));

    CSS.addClass(lineWrapper, 'user-timeline');
    lineWrapper.appendChild(labelElement);
    element.addEventListener('mousedown', registerLineInEvent);

    element.addEventListener('mousemove', registerLineInEvent);
    element.addEventListener('mouseup', registerLineInEvent);
    element.setAttribute('data-timeline', line.user);
    CSS.addClass(element, 'time');

    lineWrapper.appendChild(element);

    return lineWrapper;
}

class Line {
    constructor (startDate, user) {
        this.startDate = startDate;
        this.user = user;
    }
}

export const events = {
    LINE_ADDED: 'timeline-line-added',
    SLICE_ADDED: 'timeline-slice-added',
    SLICE_REMOVED: 'timeline-slice-removed'
};

export default class TimeLine {
    constructor (wrapper, startDate, eventsManager) {
        this.eventsManager = eventsManager;
        this.wrapper = wrapper;
        this.startDate = startDate;

        this.slices = [];
    }

    addGroup (name) {
        let fragment = document.createDocumentFragment(),
            wrapper = document.createElement('div'),
            lineWrapper = document.createElement('div'),
            titleElement = document.createElement('div'),
            group = new TimeLine(lineWrapper, this.startDate, this.eventsManager);

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

        this.eventsManager.fireEvent(events.LINE_ADDED, line);
    }

    addSlice (slice) {
        if (this.slices.find(refSlice => refSlice === slice) === undefined) {
            this.eventsManager.fireEvent(events.SLICE_ADDED, slice);
            this.slices.push(slice);
        }
    }

    removeSlice (slice) {
        let index = this.slices.findIndex(refSlice => refSlice === slice);
        if (index >= 0) {
            this.slices.splice(index, 1);
            this.eventsManager.fireEvent(events.SLICE_REMOVED, slice);
        }
    }

    getLineSlices (line) {
        return this.slices.filter(slice => slice.line === line);
    }

    getSlice (line, tile) {
        let selectedDate = TileUtils.getDateFromTile(tile);
        return this.slices.find(refSlice => refSlice.line === line && refSlice.containsDate(selectedDate));
    }
}
