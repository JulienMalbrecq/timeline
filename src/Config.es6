import {toMidnight} from "./lib/utils/Date.es6";

let defaultConfig = {
    mainWrapper: document.getElementById('timeline'),
    refDate: new Date(),
    startHour: 8,
    tilesPerDay: 8,
    tileSize: 19,
    resourceServer: 'timeline'
};


class ConfigValues {
    constructor (config = {}) {
        Object.assign(this, config);
    }

    get startDate () { return this.refDate; }
    set startDate (date) { this.refDate = toMidnight(date); }
}


if (window.TimeLineConfig) {
    Object.assign(defaultConfig, window.TimeLineConfig);
}

export let Config = new ConfigValues(defaultConfig);