var TimeLineToolbox = (function(config) {
    var mouseIsDown = false,
        TimeLineToolbox = function (timeLine) {
            this.tools = {};
            var self = this;

            timeLine.wrapper.addEventListener('mousedown', function (ev) {
                self.startDrag(ev.line, getTileFromOffset(ev.offsetX));
            });

            timeLine.wrapper.addEventListener('mousemove', function (ev) {
                if (mouseIsDown && ev['line'] !== undefined) {
                    self.drag(ev.line, getTileFromOffset(ev.offsetX));
                }
            });

            timeLine.wrapper.addEventListener('mouseup', function (ev) {
                self.stopDrag(ev.line, getTileFromOffset(ev.offsetX));
            });
        },

        Tool = function (name) {
            this.onMouseDown = function () {};
            this.onMouseMove = function () {};
            this.onMouseUp = function () {};

            this.active = false;
        };

    document.body.addEventListener('mousedown', function (ev) { mouseIsDown = true; });
    document.body.addEventListener('mouseup', function (ev) { mouseIsDown = false; });

    function getTileFromOffset(offset) {
        return Math.floor(offset / config.tileSize);
    }

    function disableAll(tools) {
        var tool;
        for (tool in tools) {
            if (tools.hasOwnProperty(tool)) {
                tool.active = false;
            }
        }
    }

    TimeLineToolbox.prototype = {
        createTool: function (name) {
            this.tools[name] = new Tool(name);
            return this.tools[name];
        },

        selectTool: function (name) {
            disableAll(this.tools);
            if (this.tools[name] !== undefined) {
                this.tools[name].active = true;
            }
        },

        startDrag: function (line, tile) {
            console.log('start dragging at', line.user, tile);
        },

        drag: function (line, tile) {
            console.log('currently dragging at', line.user, tile);
        },

        stopDrag: function (line, tile) {
            console.log('stopped dragging at', line.user, tile);
        }
    };

    return TimeLineToolbox;
})({startHour: 8, slicesPerDay: 8, tileSize: 20});