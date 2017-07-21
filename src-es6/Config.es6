import {toMidnight} from "./lib/utils/Date.es6";

let defaultConfig = {
    mainWrapper: document.getElementById('timeline'),
    refDate: new Date(),
    startHour: 8,
    tilesPerDay: 8,
    tileSize: 19
};

class ConfigValues {
    constructor (config = {}) {
        Object.assign(this, config);
    }

    get startDate () { return this.refDate; }
    set startDate (date) { this.refDate = toMidnight(date); }
}

export let Config = new ConfigValues(defaultConfig);