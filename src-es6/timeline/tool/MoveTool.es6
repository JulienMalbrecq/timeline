import TimeLineTool from "./TimeLineTool.es6";
import {getTileFromDate, getDateFromTile} from "../../lib/utils/Tile.es6";

export default class MoveTool extends TimeLineTool {
    constructor(timeLine, timeSliceManager) {
        super('move', timeLine);

        this.timeSliceManager = timeSliceManager;

        this.origin = null;
        this.selectedSlice = null;
    }

    mouseDown(line, tile) {
        this.selectedSlice = this.timeLine.getSlice(line, tile);
        if (this.selectedSlice) {
            this.origin = {
                line,
                tile,
                startTile: getTileFromDate(this.selectedSlice.startDate),
                endTile: getTileFromDate(this.selectedSlice.endDate)
            };
        }
    }

    mouseMove(line, tile) {
        if (this.selectedSlice) {
            this.computeNewPosition(tile);
        }
    }

    mouseUp(line, tile) {
        if (this.selectedSlice) {
            let updated = this.timeSliceManager.persist(this.selectedSlice);
            if (false === updated) {
                // cancel movement
                this.computeNewPosition(this.origin.tile);
            }
        }

        this.origin = null;
        this.selectedSlice = null;
    }

    computeNewPosition (tile) {
        let tileMove = tile - this.origin.tile;
        this.selectedSlice.startDate = getDateFromTile(this.origin.startTile + tileMove);
        this.selectedSlice.endDate = getDateFromTile(this.origin.endTile + tileMove);
    }
}