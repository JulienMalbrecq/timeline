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
            let updated = this.timeSliceManager.update(this.selectedSlice);
            if (false === updated) {
                // cancel movement
                this.computeNewPosition(this.origin.tile);
            }
        }

        this.origin = null;
        this.selectedSlice = null;
    }

    computeNewPosition (tile) {
        let tileMove = tile - this.origin.tile,
            newEnd = this.origin.endTile + tileMove,
            newStart = this.origin.startTile + tileMove;

        if (this.origin.tile === this.origin.startTile) { // start tile is grabbed
          if (newStart >= 0 && newStart <= this.origin.endTile) {
              this.selectedSlice.startDate = getDateFromTile(newStart);
          }
        } else if (this.origin.tile === this.origin.endTile) { // end tile is grabbed
            if (newEnd >= this.origin.startTile) {
                this.selectedSlice.endDate = getDateFromTile(newEnd);
            }
        } else if (newStart >= 0) { // slice is grabbed in the midle
            this.selectedSlice.startDate = getDateFromTile(newStart);
            this.selectedSlice.endDate = getDateFromTile(newEnd);
        }
    }
}
