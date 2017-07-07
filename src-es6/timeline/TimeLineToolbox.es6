import * as CSS from '../lib/utils/CSS';
import CreateTool from './tool/CreateTool';
import TimeLineTool from './tool/TimeLineTool';

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

export default class TimeLineToolbox {
    constructor(timeLine, mouseListener) {
        this.timeLine = timeLine;
        this.mouseListener = mouseListener;
        this.tools = {};
        this.attachedButtons = [];

        timeLine.wrapper.addEventListener('mousedown', ev => {
            handleMouseEvent(createMouseEvent('mouseDown', ev.line, ev.offsetX), this.tools);
        });

        timeLine.wrapper.addEventListener('mousemove', ev => {
            if (this.mouseListener.isDown && ev['line'] !== undefined) {
                handleMouseEvent(createMouseEvent('mouseMove', ev.line, ev.offsetX), this.tools);
            }
        });

        timeLine.wrapper.addEventListener('mouseup', ev => {
            handleMouseEvent(createMouseEvent('mouseUp', ev.line, ev.offsetX), this.tools);
        });
    }

    initTools () {
        let createTool = new CreateTool()
    }

    createTool (name) {
        this.tools[name] = new TimeLineTool(name);
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
