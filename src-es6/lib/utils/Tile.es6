import {INTERVAL, setHour, dateDiff} from "./Date.es6";

export let getTileFromOffset = function (offset) {
    return Math.floor(offset / config.tileSize);
};


export let getTileFromDate = function (date, refDate = config.startDate, startHour = config.startHour, tilePerDay = config.tilesPerDay) {
    let startOfDay = setHour(new Date(date), startHour);
    return dateDiff(date, refDate, INTERVAL.ONEDAY) * tilePerDay + dateDiff(date, startOfDay, INTERVAL.ONEHOUR);
};

export let getDaysFromTile = function (tile) {
    return Math.floor(tile / config.tilesPerDay);
};

export let getDateFromTile = function (tile, startDate = config.startDate) {
    return new Date(startDate.getTime() + (INTERVAL.ONEDAY * getDaysFromTile(tile)) + (INTERVAL.ONEHOUR * (config.startHour + (tile % config.tilesPerDay))));
};

export let getTileLengthFromDuration = function (duration) {
    return Math.ceil(duration / INTERVAL.ONEHOUR);
};