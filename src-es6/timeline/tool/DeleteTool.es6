import TimeLineTool from "./TimeLineTool.es6";

export default class DeleteTool extends TimeLineTool {
    constructor(timeLine, timeSliceManager) {
        super('delete', timeLine);
        this.timeSliceManager = timeSliceManager;

        this.selectedSlice = null;
    }

    mouseDown(line, tile) {
        this.selectedSlice = this.timeLine.getSlice(line, tile);
    }

    mouseUp(line, tile) {
        if (this.selectedSlice) {
            let currentSlice = this.timeLine.getSlice(line, tile);
            if (this.selectedSlice === currentSlice) {
                this.timeSliceManager.remove(this.selectedSlice);
            }
        }

        this.selectedSlice = null;
    }
}
