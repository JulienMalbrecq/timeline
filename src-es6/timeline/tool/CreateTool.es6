import TimeLineTool from './TimeLineTool';
import TimeSliceFactory from '../data/TimeSlice';

export default class CreateTool extends TimeLineTool {
    constructor() {
        super('create');
        this.lastSlice = null;
    }

    mouseDown(line, tile) {
        if (line !== null) {
            let date = this.timeLine.getDateFromTile(tile);
            this.lastSlice = TimeSliceFactory.create(null, line.user, date, date);
        }
    };

    mouseMove(line, tile) {
        let date = this.timeLine.getDateFromTile(tile);
        if (this.lastSlice && date >= this.lastSlice.startDate) {
            this.lastSlice.endDate = date;
        }
    }

    mouseUp(line, tile) {
        this.lastSlice = null;
    }
}