import * as CSS from '../lib/utils/CSS';

function getTileFromOffset(offset) {
    return Math.floor(offset / config.tileSize);
}

function createMouseEvent(event, line, offset) {
    return {
        event,
        line,
        tile: getTileFromOffset(offset)
    };
}

function handleMouseEvent(mouseEvent, tools) {
    let activeTool = getActiveTool(tools);
    if (activeTool && activeTool[mouseEvent.event]) {
        activeTool[mouseEvent.event](mouseEvent.line, mouseEvent.tile);
    }
}

function getActiveTool(tools) {
    return Object.values(tools).find(tool => tool.active);
}

function redraw(buttons) {
    buttons.forEach(button => {
        let action = button.tool.active ? 'addClass' : 'removeClass';
        CSS[action](button.button, 'active');
    });
}

export class Tool {
    constructor (name) {
        this.mousedown = this.mousemove = this.mouseup = function () {};
        this.name = name;
        this.active = false;
    }
}

export default class TimeLineToolbox {
    constructor(timeLine, mouseListener) {
        this.mouseListener = mouseListener;
        this.tools = {};
        this.attachedButtons = [];

        timeLine.wrapper.addEventListener('mousedown', ev => {
            handleMouseEvent(createMouseEvent('mousedown', ev.line, ev.offsetX), this.tools);
        });

        timeLine.wrapper.addEventListener('mousemove', ev => {
            if (this.mouseListener.isDown && ev['line'] !== undefined) {
                handleMouseEvent(createMouseEvent('mousemove', ev.line, ev.offsetX), this.tools);
            }
        });

        timeLine.wrapper.addEventListener('mouseup', ev => {
            handleMouseEvent(createMouseEvent('mouseup', ev.line, ev.offsetX), this.tools);
        });
    }

    createTool (name) {
        this.tools[name] = new Tool(name);
        return this.tools[name];
    }

    attachButton (tool, button) {
        button.addEventListener('click', ev => {
            // disable all tools
            Object.values(this.tools).forEach(tool =>  tool.active = false );
            if (this.tools[tool.name] !== undefined) {
                this.tools[tool.name].active = true;
            }

            // redraw
            redraw(this.attachedButtons);
            ev.preventDefault();
        });

        this.attachedButtons.push({button, tool});
    }
}
