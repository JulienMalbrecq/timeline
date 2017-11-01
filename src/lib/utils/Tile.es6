import {INTERVAL, setHour, dateDiff} from "./Date.es6";
import {Config} from "../../Config.es6";

export let getTileFromOffset = function (offset) {
    return Math.floor(offset / Config.tileSize);
};


export let getTileFromDate = function (date, refDate = Config.startDate, startHour = Config.startHour, tilePerDay = Config.tilesPerDay) {
    let startOfDay = setHour(new Date(date), startHour);
    return dateDiff(date, refDate, INTERVAL.ONEDAY) * tilePerDay + dateDiff(date, startOfDay, INTERVAL.ONEHOUR);
};

export let getDaysFromTile = function (tile) {
    return Math.floor(tile / Config.tilesPerDay);
};

export let getDateFromTile = function (tile, startDate = Config.startDate) {
    return new Date(startDate.getTime() + (INTERVAL.ONEDAY * getDaysFromTile(tile)) + (INTERVAL.ONEHOUR * (Config.startHour + (tile % Config.tilesPerDay))));
};

export let getTileLengthFromDuration = function (duration) {
    return Math.ceil(duration / INTERVAL.ONEHOUR);
};