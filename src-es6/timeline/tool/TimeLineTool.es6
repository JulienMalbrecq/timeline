export default class TimeLineTool {
    constructor (name, timeLine = null, mouseListener = null) {
        this.name = name;
        this.active = false;

        this.timeLine = timeLine;
        this.mouseListener = mouseListener;
    }

    mouseDown (line, tile) {}
    mouseMove (line, tile) {}
    mouseUp   (line, tile) {}
}