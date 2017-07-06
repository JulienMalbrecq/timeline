'use strict';

var _OverlapResolver = require('timeline/OverlapResolver');

var _OverlapResolver2 = _interopRequireDefault(_OverlapResolver);

var _TimeLine = require('timeline/TimeLine');

var _TimeLine2 = _interopRequireDefault(_TimeLine);

var _TimeLineRenderer = require('timeline/TimeLineRenderer');

var _TimeLineRenderer2 = _interopRequireDefault(_TimeLineRenderer);

var _TimeLineToolbox = require('timeline/TimeLineToolbox');

var _TimeLineToolbox2 = _interopRequireDefault(_TimeLineToolbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function App(wrapper, refDate) {
    this.wrapper = wrapper;
    this.refDate = refDate;

    this.eventManager = new EventsManager({ private: true });

    this.overlapResolver = new _OverlapResolver2.default(this.eventManager);
    this.timeLine = new _TimeLine2.default(wrapper, refDate);
    this.renderer = new _TimeLineRenderer2.default(wrapper, refDate);

    this.toolBox = new _TimeLineToolbox2.default(timeLine);

    // add a data manager which will manage the loading and rendering of the timelines
};