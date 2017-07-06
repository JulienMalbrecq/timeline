'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TimeLineToolbox = exports.Tool = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CSS = require('lib/utils/CSS');

var CSS = _interopRequireWildcard(_CSS);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

function getActiveTool(tools) {
    var tool;

    for (tool in tools) {
        if (tools.hasOwnProperty(tool) && tools[tool].active) {
            return tools[tool];
        }
    }
}

function redraw(buttons) {
    buttons.forEach(function (button) {
        var action = button.tool.active ? 'addClass' : 'removeClass';
        CSS[action](button.button, 'active');
    });
}

var Tool = exports.Tool = function Tool(name) {
    _classCallCheck(this, Tool);

    this.mousedown = this.mousemove = this.mouseup = function () {};
    this.name = name;
    this.active = false;
};

var TimeLineToolbox = exports.TimeLineToolbox = function () {
    function TimeLineToolbox(timeLine, mouseListener) {
        var _this = this;

        _classCallCheck(this, TimeLineToolbox);

        this.mouseListener = mouseListener;
        this.tools = {};
        this.attachedButtons = [];

        var toolbox = this;

        timeLine.wrapper.addEventListener('mousedown', function (ev) {
            handleMouseEvent(createMouseEvent('mousedown', ev.line, ev.offsetX), _this.tools);
        });

        timeLine.wrapper.addEventListener('mousemove', function (ev) {
            if (_this.mouseListener.isDown() && ev['line'] !== undefined) {
                handleMouseEvent(createMouseEvent('mousemove', ev.line, ev.offsetX), _this.tools);
            }
        });

        timeLine.wrapper.addEventListener('mouseup', function (ev) {
            handleMouseEvent(createMouseEvent('mouseup', ev.line, ev.offsetX), toolbox.tools);
        });
    }

    _createClass(TimeLineToolbox, [{
        key: 'createTool',
        value: function createTool(name) {
            this.tools[name] = new Tool(name);
            return this.tools[name];
        }
    }, {
        key: 'attachButton',
        value: function attachButton(tool, button) {
            var _this2 = this;

            button.addEventListener('click', function (ev) {
                // disable all tools
                Object.keys(_this2.tools).forEach(function (toolName) {
                    return _this2.tools[toolName].active = false;
                });
                if (_this2.tools[tool.name] !== undefined) {
                    _this2.tools[tool.name].active = true;
                }

                // redraw
                redraw(_this2.attachedButtons);
                ev.preventDefault();
            });

            this.attachedButtons.push({ button: button, tool: tool });
        }
    }]);

    return TimeLineToolbox;
}();