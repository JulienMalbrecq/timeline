import {INTERVAL, toMidnight} from "../../lib/utils/Date.es6";
import * as CSS from "../../lib/utils/CSS.es6";

export default class TimeLineHeaderWidget {
    constructor(refDate, tileWidth, tilePerDay = 8, daysToShow = 14) {
        this.refDate = refDate;
        this.tileWidth = tileWidth;
        this.tilePerDay = tilePerDay;
        this._daysToShow = daysToShow;

        this.wrapper = null;
    }

    set daysToShow (days) {
        this._daysToShow = days;
        // @todo update interface
    }

    get dayWidth () {
        return this.tilePerDay * this.tileWidth;
    }

    createInterface() {
        console.log('called');
        /** @var Node this.wrapper */
        this.wrapper = document.querySelector('[data-widget="timeline-headers"]');
        if (!this.wrapper) {
            console.log('not found');
            return;
        }

        [...this.wrapper.childNodes].forEach(node => document.removeChild(node));

        let tempWrapper = document.createDocumentFragment(),
            date = new Date(toMidnight(this.refDate)),
            i;

        for (i = 0; i < this._daysToShow; i += 1) {
            tempWrapper.appendChild(this.createDayHeader(date));
            date = new Date(date.getTime() + INTERVAL.ONEDAY);
        }

        this.wrapper.style.width = `${this.dayWidth * this._daysToShow}px`;
        this.wrapper.appendChild(tempWrapper);
    }

    createDayHeader (day) {
        let element = document.createElement('div'),
            label = document.createTextNode(day.toLocaleDateString('fr-FR'));

        element.appendChild(label);
        element.style.width = `${this.dayWidth}px`;

        CSS.addClass(element, 'day');

        if (toMidnight(day).getTime() === toMidnight(new Date()).getTime()) {
            CSS.addClass(element, 'today');
        }

        return element;
    }
}