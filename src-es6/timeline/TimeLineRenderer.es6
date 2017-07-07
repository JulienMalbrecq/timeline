import {tileFromDate} from '../lib/utils/Date';

export default class TimeLineRenderer {
    constructor(wrapper, refDate) {
        this.wrapper = wrapper;
        this.refDate = refDate;
        this.slices = [];
    }

    addSlice (timeSlice, line) {
        let element = document.createElement('div');
        element.appendChild(document.createTextNode(timeSlice.project.name));

        element.setAttribute('class', 'time-slice');
        element.style.top = line.wrapper.offsetTop + 'px';
        this.wrapper.appendChild(element);
        this.slices.push({element, line, timeSlice});

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
        this.slices.forEach(slice => {
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
        });
    }
}