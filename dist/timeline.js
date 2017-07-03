2017-07-03
var OverlapResolver = (function (){
    var OverlapResolver = function (eventManager) { this.eventManager = eventManager; },
        ONEHOUR = 3600000,
        flags = {
            REF_START: 1,
            REF_END: 2,
            NEW_START: 4,
            NEW_END: 8
        },
        masks = {
            SURROUND: flags.REF_START | flags.REF_END,
            OVERLAP_START: flags.REF_START | flags.NEW_END,
            OVERLAP_END: flags.REF_END | flags.NEW_START,
            WITHIN: flags.NEW_START | flags.NEW_END
        };

    OverlapResolver.resolutionType = {
        RESOLUTION_WITHIN: 0,
        RESOLUTION_OVERLAP_START: 1,
        RESOLUTION_OVERLAP_END: 2,
        RESOLUTION_SURROUND: 3
    };

    OverlapResolver.event = {
        RESOLVED_OVERLAP: 'overlap-resolver-resolved-overlap',
        RESOLVED_MERGE: 'overlap-resolver-resolved-overlap'
    };

    function isWithinRange (refSlice, searchDate) {
        return searchDate >= refSlice.startDate && searchDate <= refSlice.endDate;
    }

    function computeOverlapScore (refSlice, newSlice) {
        var score = 0;

        if (isWithinRange(newSlice, refSlice.startDate)) {
            score |= flags.REF_START;
        }

        if (isWithinRange(newSlice, refSlice.endDate)) {
            score |= flags.REF_END;
        }

        if (isWithinRange(refSlice, newSlice.startDate)) {
            score |= flags.NEW_START;
        }

        if (isWithinRange(refSlice, newSlice.endDate)) {
            score |= flags.NEW_END;
        }

        return score;
    }

    function compareAgainstMask(score, mask) {
        return (score & mask) === mask;
    }

    function resolveMerge(refSlice, newSlice) {
        var score = computeOverlapScore(refSlice, newSlice),
            resolution = [refSlice, newSlice];

        if (compareAgainstMask(score, masks.WITHIN)) {
            resolution.push(OverlapResolver.resolutionType.RESOLUTION_WITHIN);
        } else if (compareAgainstMask(score, masks.OVERLAP_START)) {
            refSlice.startDate = newSlice.startDate;
            resolution.push(OverlapResolver.resolutionType.RESOLUTION_OVERLAP_START);
        } else if (compareAgainstMask(score, masks.OVERLAP_END)) {
            refSlice.endDate = newSlice.endDate;
            resolution.push(OverlapResolver.resolutionType.RESOLUTION_OVERLAP_END);
        } else if (compareAgainstMask(score, masks.SURROUND)) {
            refSlice.startDate = newSlice.startDate;
            refSlice.endDate = newSlice.endDate;
            resolution.push(OverlapResolver.resolutionType.RESOLUTION_SURROUND);
        } else {
            resolution = null;
        }

        return resolution;
    }

    function resolveOverlap(refSlice, newSlice) {
        var score = computeOverlapScore(refSlice, newSlice),
            resolution = [refSlice, newSlice],
            duplicate;

        if (compareAgainstMask(score, masks.WITHIN)) {
            resolution.push(OverlapResolver.resolutionType.RESOLUTION_WITHIN);
        } else if (compareAgainstMask(score, masks.OVERLAP_START)) {
            refSlice.startDate.setTime(newSlice.endDate.getTime() + ONEHOUR);
            resolution.push(OverlapResolver.resolutionType.RESOLUTION_OVERLAP_START);
        } else if (compareAgainstMask(score, masks.OVERLAP_END)) {
            refSlice.endDate.setTime(newSlice.startDate.getTime() - ONEHOUR);
            resolution.push(OverlapResolver.resolutionType.RESOLUTION_OVERLAP_END);
        } else {
            duplicate = TimeSliceFactory.create(refSlice.project, refSlice.startDate, refSlice.endDate);
            duplicate.startDate.setTime(newSlice.endDate.getTime() + ONEHOUR);
            refSlice.endDate.setTime(newSlice.startDate.getTime() - ONEHOUR);
            resolution.push(OverlapResolver.resolutionType.RESOLUTION_SURROUND);
            resolution.push(duplicate);
        }

        return duplicate;
    }

    OverlapResolver.prototype = {
        isOverlapping: function (refSlice, newSlice) {
            return computeOverlapScore(refSlice, newSlice) > 0;
        },

        resolve: function (refSlice, newSlice) {
            var event, resolution;
            if (this.isOverlapping(refSlice, newSlice)) {
                event = refSlice.project === newSlice.project ? OverlapResolver.event.RESOLVED_MERGE : OverlapResolver.event.RESOLVED_OVERLAP;
                resolution = refSlice.project === newSlice.project ? resolveMerge(refSlice, newSlice) : resolveOverlap(refSlice, newSlice);
                this.eventManager.fire(event, resolution);
            }
        }
    };

    return OverlapResolver;
})();

var TimeLine = (function (doc, config) {
    var Line, TimeLine;

    function getDaysFromTile(tile) {
        return Math.floor(tile / config.tilesPerDay);
    }

    function getTileFromDate(date, refDate) {
        var startOfDay = DateUtils.setHour(new Date(date.getTime()), config.startHour),
            timeDiff = date.getTime() - refDate.getTime(),
            days = Math.floor(timeDiff/DateUtils.INTERVAL.ONEDAY);

        return days * config.tilesPerDay + Math.floor((date.getTime() - startOfDay.getTime()) / DateUtils.INTERVAL.ONEHOUR);
    }

    function createTimeLineElement(line) {
        var element = doc.createElement('div'),
            registerLineInEvent = function (ev) {
                ev.line = line;
            };

        element.addEventListener('mousedown', registerLineInEvent);
        element.addEventListener('mousemove', registerLineInEvent);
        element.addEventListener('mouseup', registerLineInEvent);

        element.setAttribute('data-timeline', line.user);
        return element;
    }

    Line = function (startDate, user) {
        this.startDate = startDate;
        this.user = user;
    };

    TimeLine = function (wrapper, startDate) {
        this.wrapper = wrapper;
        this.startDate = startDate;
    };

    TimeLine.prototype = {
        addGroup: function (name) {
            var fragment = doc.createDocumentFragment(),
                wrapper = doc.createElement('div'),
                lineWrapper = doc.createElement('div'),
                titleElement = doc.createElement('div'),
                group = new TimeLine(lineWrapper, this.startDate);

            wrapper.setAttribute('class', 'group-wrapper');
            lineWrapper.setAttribute('class', 'line-wrapper');

            titleElement.appendChild(doc.createTextNode(name));
            wrapper.appendChild(titleElement);
            wrapper.appendChild(lineWrapper);
            fragment.appendChild(wrapper);

            this.wrapper.appendChild(fragment);

            return group;
        },

        addLine: function (user) {
            var line = new Line(this.startDate, user),
                element = createTimeLineElement(line);

            line.wrapper = element;

            this.wrapper.appendChild(element);
        },

        getDateFromTile: function (tile) {
            return new Date(this.startDate.getTime() + (DateUtils.INTERVAL.ONEDAY * getDaysFromTile(tile)) + (DateUtils.INTERVAL.ONEHOUR * (config.startHour + (tile % config.tilesPerDay))));
        }
    };

    return TimeLine;
})(document, MainConfig.timeline);
var TimeLineApp = (function () {
    var App = function (wrapper, refDate) {
        this.wrapper = wrapper;
        this.refDate = refDate;

        this.eventManager = new EventsManager({private: true});

        this.overlapResolver = new OverlapResolver(this.eventManager);
        this.timeLine = new TimeLine(wrapper, refDate);
        this.renderer = new TimeLineRenderer(wrapper, refDate);

        this.toolBox = new TimeLineToolbox(timeLine);

        // add a data manager which will manage the loading and rendering of the timelines
    };



    return App;
})();
var TimeLineRenderer = (function (doc, config) {
    var TimeLineRenderer = function (wrapper, refDate) {
        this.wrapper = wrapper;
        this.refDate = refDate;
        this.slices = [];
    };

    TimeLineRenderer.prototype = {
        addSlice: function (timeSlice, line) {
            var element = doc.createElement('div');
            element.appendChild(doc.createTextNode(timeSlice.project.name));

            element.setAttribute('class', 'time-slice');
            element.style.top = line.wrapper.offsetTop + 'px';
            this.wrapper.appendChild(element);

            this.slices.push({
                element: element,
                line: line,
                timeSlice: timeSlice
            });

            this.refresh();
        },

        removeSlice: function (timeSlice) {
            var slice = this.slices.findIndex(function (slice) { return slice.timeSlice === timeSlice; });
            if (slice >= 0) {
                this.wrapper.removeChild(this.slices[slice].element);
                this.slices.splice(slice, 1);
            }
        },

        refresh: function () {
            var refDate = this.refDate;
            this.slices.forEach(function (slice) {
                var startTile = DateUtils.tileFromDate(slice.timeSlice.startDate, refDate, config.startHour, config.tilesPerDay),
                    endTile = DateUtils.tileFromDate(slice.timeSlice.endDate, refDate, config.startHour, config.tilesPerDay) + 1,
                    totalTiles = endTile - startTile;

                slice.element.style.width = (totalTiles * config.tileSize) + 'px';
                slice.element.style.left = (startTile * config.tileSize) + 'px';
                slice.element.style.top = slice.line.wrapper.offsetTop + 'px';
                slice.element.style.backgroundColor = slice.timeSlice.project.color;
            });
        }
    };

    return TimeLineRenderer;
})(document, MainConfig.timeline);
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
})(MouseStateListener, MainConfig.timeline);
var ProjectFactory = (function () {
    var Project = function (name, color) {
        this.name = name;
        this.color = color;
    };

    Project.prototype = {};

    return {
        create : function (name, color) {
            return new Project(name, color);
        }
    };
})();
var TimeLineDataManager = (function (config) {
    var TimeLineDataManager = function (eventManager) {
        this.eventManager = eventManager;
    };

    TimeLineDataManager.prototype = {
        load: function (serviceName, options, callback) {
            if (false === serviceName in config) {
                throw 'Unknown service ' + serviceName;
            }

            // use fermata here
        }
    };
})(MainConfig.services);
var TimeSliceFactory = (function () {
    var TimeSlice = function (project, user, startDate, endDate) {
            this.project = project;
            this.user = user;
            this.startDate = startDate;
            this.endDate = endDate;
        };

    TimeSlice.prototype = {};

    return {
        create : function (project, user, startDate, endDate) {
            return new TimeSlice(project, user, startDate, endDate);
        }
    };
})();