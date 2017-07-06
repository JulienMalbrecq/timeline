'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Date = require('lib/utils/Date');

var _Date2 = _interopRequireDefault(_Date);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TimeLineRenderer = function () {
    function TimeLineRenderer(wrapper, refDate) {
        _classCallCheck(this, TimeLineRenderer);

        this.wrapper = wrapper;
        this.refDate = refDate;
        this.slices = [];
    }

    _createClass(TimeLineRenderer, [{
        key: 'addSlice',
        value: function addSlice(timeSlice, line) {
            var element = document.createElement('div');
            element.appendChild(document.createTextNode(timeSlice.project.name));

            element.setAttribute('class', 'time-slice');
            element.style.top = line.wrapper.offsetTop + 'px';
            this.wrapper.appendChild(element);
            this.slices.push({ element: element, line: line, timeSlice: timeSlice });

            this.refresh();
        }
    }, {
        key: 'removeSlice',
        value: function removeSlice(timeSlice) {
            var slice = this.slices.findIndex(function (slice) {
                return slice.timeSlice === timeSlice;
            });
            if (slice >= 0) {
                this.wrapper.removeChild(this.slices[slice].element);
                this.slices.splice(slice, 1);
            }
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            var _this = this;

            this.slices.forEach(function (slice) {
                var startTile = (0, _Date2.default)(slice.timeSlice.startDate, _this.refDate, config.startHour, config.tilesPerDay),
                    endTile = (0, _Date2.default)(slice.timeSlice.endDate, _this.refDate, config.startHour, config.tilesPerDay) + 1,
                    totalTiles = endTile - startTile;

                slice.element.style.width = totalTiles * config.tileSize + 'px';
                slice.element.style.left = startTile * config.tileSize + 'px';
                slice.element.style.top = slice.line.wrapper.offsetTop + 'px';
                slice.element.style.backgroundColor = slice.timeSlice.project.color;
            });
        }
    }]);

    return TimeLineRenderer;
}();

exports.default = TimeLineRenderer;