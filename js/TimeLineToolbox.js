var TimeLineToolbox = (function(mouse, config) {
    var TimeLineToolbox, Tool;

    function getTileFromOffset(offset) {
        return Math.floor(offset / config.tileSize);
    }

    function createMouseEvent(event, line, offset) {
        return {
            event: event,
            line: line,
            tile: getTileFromOffset(offset)
        };
    }

    function handleMouseEvent(mouseEvent, tools) {
        var activeTool = getActiveTool(tools);
        if (activeTool && activeTool[mouseEvent.event]) {
            activeTool[mouseEvent.event](mouseEvent.line, mouseEvent.tile);
        }
    }

    function disableAll(tools) {
        Object.keys(tools).forEach(function (toolName) {
            tools[toolName].active = false;
        });
    }

    function getActiveTool(tools) {
        var tool;

        for (tool in tools) {
            if (tools.hasOwnProperty(tool) && tools[tool].active) {
                return tools[tool];
            }
        }
    }

    function setActive(name, tools) {
        disableAll(tools);

        if (tools[name] !== undefined) {
            tools[name].active = true;
        }
    }

    function buttonClickCallback(toolbox, tool) {
        return function (ev) {
            setActive(tool.name, toolbox.tools);
            redraw(toolbox.attachedButtons);
            ev.preventDefault();
        }
    }

    function redraw(buttons) {
        buttons.forEach(function (button) {
            var action = button.tool.active ? 'addClass' : 'removeClass';
            Utils.CSS[action](button.button, 'active');
        });
    }

    Tool = function (name) {
        this.mousedown = this.mousemove = this.mouseup = function () {};
        this.name = name;
        this.active = false;
    };

    TimeLineToolbox = function (timeLine) {
        this.tools = {};
        this.attachedButtons = [];

        var toolbox = this;

        timeLine.wrapper.addEventListener('mousedown', function (ev) {
            handleMouseEvent(createMouseEvent('mousedown', ev.line, ev.offsetX), toolbox.tools);
        });

        timeLine.wrapper.addEventListener('mousemove', function (ev) {
            if (mouse.isDown() && ev['line'] !== undefined) {
                handleMouseEvent(createMouseEvent('mousemove', ev.line, ev.offsetX), toolbox.tools);
            }
        });

        timeLine.wrapper.addEventListener('mouseup', function (ev) {
            handleMouseEvent(createMouseEvent('mouseup', ev.line, ev.offsetX), toolbox.tools);
        });
    };

    TimeLineToolbox.prototype = {
        createTool: function (name) {
            this.tools[name] = new Tool(name);
            return this.tools[name];
        },

        attachButton: function (tool, button) {
            button.addEventListener('click', buttonClickCallback(this, tool));
            this.attachedButtons.push({button: button, tool: tool});
        }
    };

    return TimeLineToolbox;
})(MouseStateListener, MainConfig);