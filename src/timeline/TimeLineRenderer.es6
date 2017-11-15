import {getTileFromDate} from '../lib/utils/Tile.es6';
import * as ColorUtils from '../lib/utils/Color.es6';
import {Config} from "../Config.es6";

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

            let startTile = getTileFromDate(slice.startDate),
                endTile, totalTiles, style;

            if (startTile < 0) {
                startTile = 0;
            }

            endTile = getTileFromDate(slice.endDate) + 1;
            totalTiles = endTile - startTile;
            style = {
                width: `${totalTiles * Config.tileSize}px`,
                left: `${startTile * Config.tileSize}px`,
                backgroundColor: `${slice.project.color}`
            };

            Object.assign(slice.element.style, style);
            slice.changed = false;
        });
    }

    initSlice (slice) {
        let element = document.createElement('div'),
            classNames = ['time-slice'];

        if (ColorUtils.isDark(slice.project.color, 130)) {
            classNames.push('dark-background');
        }

        element.appendChild(document.createTextNode(slice.project.name));
        element.setAttribute('class', classNames.join(' '));
        element.setAttribute('title', slice.project.name);

        slice.element = element;
    }
}