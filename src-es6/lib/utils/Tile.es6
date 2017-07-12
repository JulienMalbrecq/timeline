export let getTileFromOffset = function (offset) {
    return Math.floor(offset / config.tileSize);
};