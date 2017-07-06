'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TimeLine = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Date = require('lib/utils/Date');

var _Date2 = _interopRequireDefault(_Date);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getDaysFromTile(tile) {
    return Math.floor(tile / config.tilesPerDay);
}

function createTimeLineElement(line) {
    var element = document.createElement('div'),
        registerLineInEvent = function registerLineInEvent(ev) {
        ev.line = line;
    };

    element.addEventListener('mousedown', registerLineInEvent);
    element.addEventListener('mousemove', registerLineInEvent);
    element.addEventListener('mouseup', registerLineInEvent);
    element.setAttribute('data-timeline', line.user);
    return element;
}

var Line = function Line(startDate, user) {
    _classCallCheck(this, Line);

    this.startDate = startDate;
    this.user = user;
};

var TimeLine = exports.TimeLine = function () {
    function TimeLine(wrapper, startDate) {
        _classCallCheck(this, TimeLine);

        this.wrapper = wrapper;
        this.startDate = startDate;
    }

    _createClass(TimeLine, [{
        key: 'addGroup',
        value: function addGroup(name) {
            var fragment = document.createDocumentFragment(),
                wrapper = document.createElement('div'),
                lineWrapper = document.createElement('div'),
                titleElement = document.createElement('div'),
                group = new TimeLine(lineWrapper, this.startDate);

            wrapper.setAttribute('class', 'group-wrapper');
            lineWrapper.setAttribute('class', 'line-wrapper');

            titleElement.appendChild(document.createTextNode(name));
            wrapper.appendChild(titleElement);
            wrapper.appendChild(lineWrapper);
            fragment.appendChild(wrapper);

            this.wrapper.appendChild(fragment);

            return group;
        }
    }, {
        key: 'addLine',
        value: function addLine(user) {
            var line = new Line(this.startDate, user),
                element = createTimeLineElement(line);

            line.wrapper = element;
            this.wrapper.appendChild(element);
        }
    }, {
        key: 'getDateFromTile',
        value: function getDateFromTile(tile) {
            return new Date(this.startDate.getTime() + _Date2.default.ONEDAY * getDaysFromTile(tile) + _Date2.default.ONEHOUR * (config.startHour + tile % config.tilesPerDay));
        }
    }]);

    return TimeLine;
}();