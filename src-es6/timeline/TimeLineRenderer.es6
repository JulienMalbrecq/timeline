import {tileFromDate} from '../lib/utils/Date.es6';

export default class TimeLineRenderer {
    constructor(wrapper = null, refDate = null) {
        this.wrapper = wrapper;
        this.refDate = refDate;
        this.slices = [];
    }

    addSlice (timeSlice) {
        let element = document.createElement('div');
        element.appendChild(document.createTextNode(timeSlice.project.name));

        element.setAttribute('class', 'time-slice');
        element.style.top = timeSlice.line.wrapper.offsetTop + 'px';

        this.wrapper.appendChild(element);

        this.slices.push({element, line: timeSlice.line, timeSlice});

        this.refresh();
    }

    removeSlice (timeSlice) {
        let slice = this.slices.findIndex(slice => slice.timeSlice === timeSlice);
        if (slice >= 0) {
            this.wrapper.removeChild(this.slices[slice].element);
            this.slices.splice(slice, 1);
        }
    }

    refresh () {
        this.slices.filter(slice => slice.timeSlice.changed).forEach(slice => {
            let startTile = tileFromDate(slice.timeSlice.startDate, this.refDate, config.startHour, config.tilesPerDay),
                endTile = tileFromDate(slice.timeSlice.endDate, this.refDate, config.startHour, config.tilesPerDay) + 1,
                totalTiles = endTile - startTile,
                style = {
                    width: `${totalTiles * config.tileSize}px`,
                    left: `${startTile * config.tileSize}px`,
                    top: `${slice.line.wrapper.offsetTop}px`,
                    backgroundColor: `${slice.timeSlice.project.color}`
                };

            Object.assign(slice.element.style, style);
            slice.timeSlice.changed = false;
        });
    }
}