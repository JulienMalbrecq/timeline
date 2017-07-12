import {getTileFromDate} from '../lib/utils/Tile.es6';

export default class TimeLineRenderer {
    constructor(wrapper = null, refDate = null) {
        this.wrapper = wrapper;
        this.refDate = refDate;
    }

    render (slices) {
        slices.forEach(slice => {
            if (false === slice.changed) {
                return;
            }

            if (slice.element === undefined) {
                this.initSlice(slice);
            }

            let startTile = getTileFromDate(slice.startDate),
                endTile = getTileFromDate(slice.endDate) + 1,
                totalTiles = endTile - startTile,
                style = {
                    width: `${totalTiles * config.tileSize}px`,
                    left: `${startTile * config.tileSize}px`,
                    top: `${slice.line.wrapper.offsetTop}px`,
                    backgroundColor: `${slice.project.color}`
                };

            Object.assign(slice.element.style, style);
            slice.changed = false;
        });
    }

    initSlice (slice) {
        let element = document.createElement('div');
        element.appendChild(document.createTextNode(slice.project.name));
        element.setAttribute('class', 'time-slice');
        element.style.top = slice.line.wrapper.offsetTop + 'px';
        this.wrapper.appendChild(element);

        slice.element = element;
    }
}