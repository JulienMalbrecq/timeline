import * as CSS from '../lib/utils/CSS.es6';
import * as TileUtils from '../lib/utils/Tile.es6';

export default class TimeLineToolbox {
    constructor(timeLine = null, mouseListener = null) {
        this.timeLine = timeLine;
        this.mouseListener = mouseListener;
        this.tools = [];
        this.attachedButtons = [];
        this.initListeners();
    }

    initListeners() {
        if (this.timeLine && this.mouseListener) {
            this._toolDependencies = {timeLine: this.timeLine, mouseListener: this.mouseListener};

            this.timeLine.wrapper.addEventListener('mousedown', ev => {
                this.handleMouseEvent('mouseDown', ev.line, ev.offsetX);
            });

            this.timeLine.wrapper.addEventListener('mousemove', ev => {
                if (this.mouseListener.isDown && ev['line'] !== undefined) {
                    this.handleMouseEvent('mouseMove', ev.line, ev.offsetX);
                }
            });

            this.mouseListener.wrapper.addEventListener('mouseup', ev => {
                this.handleMouseEvent('mouseUp', ev.line, ev.offsetX);
            });

            this.tools.forEach(tool => Object.assign(tool, this._toolDependencies));
        }
    }

    addTool(timeLineTool) {
        Object.assign(timeLineTool, this._toolDependencies);
        this.tools.push(timeLineTool);
    }

    getToolByName (name) {
        return this.tools.find(tool => tool.name === name);
    }

    attachButton (button, tool) {
        button.addEventListener('click', ev => {
            ev.preventDefault();

            // disable all but this tool
            this.tools.forEach(iTool => iTool.active = iTool === tool );
            this.redraw();
        });

        this.attachedButtons.push({button, tool});
    }

    handleMouseEvent (eventName, line, offset) {
        let tile = TileUtils.getTileFromOffset(offset),
            activeTool = this.tools.find(tool => tool.active);

        if (activeTool && activeTool[eventName]) {
            activeTool[eventName](line, tile);
        }
    }

    redraw () {
        this.attachedButtons.forEach(button => {
            let action = button.tool.active ? 'addClass' : 'removeClass';
            CSS[action](button.button, 'active');
        });
    }
}
