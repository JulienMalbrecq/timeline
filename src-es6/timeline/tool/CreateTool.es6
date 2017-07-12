import TimeLineTool from './TimeLineTool.es6';

export default class CreateTool extends TimeLineTool {
    constructor(timeLine, timeSliceManager, timeSliceFactory) {
        super('create', timeLine);
        this.lastSlice = null;
        this.currentProject = null;

        this.timeSliceManager = timeSliceManager;
        this.timeSliceFactory = timeSliceFactory;
    }

    mouseDown(line, tile) {
        if (line !== null) {
            let date = this.timeLine.getDateFromTile(tile);
            this.lastSlice = this.timeSliceFactory.create(this.currentProject, line, date, date);
        }
    };

    mouseMove(line, tile) {
        let date = this.timeLine.getDateFromTile(tile);
        if (this.lastSlice && date >= this.lastSlice.startDate) {
            this.lastSlice.endDate = date;
        }
    }

    mouseUp(line, tile) {
        this.timeSliceManager.persist(this.lastSlice);
        this.lastSlice = null;
    }
}
