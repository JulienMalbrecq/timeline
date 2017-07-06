'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.event = exports.resolutionType = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Date = require('lib/utils/Date');

var _Date2 = _interopRequireDefault(_Date);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var flags = {
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

var resolutionType = exports.resolutionType = {
    RESOLUTION_WITHIN: 0,
    RESOLUTION_OVERLAP_START: 1,
    RESOLUTION_OVERLAP_END: 2,
    RESOLUTION_SURROUND: 3
};

var event = exports.event = {
    RESOLVED_OVERLAP: 'overlap-resolver-resolved-overlap',
    RESOLVED_MERGE: 'overlap-resolver-resolved-overlap'
};

function isWithinRange(refSlice, searchDate) {
    return searchDate >= refSlice.startDate && searchDate <= refSlice.endDate;
}

function computeOverlapScore(refSlice, newSlice) {
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
        resolution.push(resolutionType.RESOLUTION_WITHIN);
    } else if (compareAgainstMask(score, masks.OVERLAP_START)) {
        refSlice.startDate = newSlice.startDate;
        resolution.push(resolutionType.RESOLUTION_OVERLAP_START);
    } else if (compareAgainstMask(score, masks.OVERLAP_END)) {
        refSlice.endDate = newSlice.endDate;
        resolution.push(resolutionType.RESOLUTION_OVERLAP_END);
    } else if (compareAgainstMask(score, masks.SURROUND)) {
        refSlice.startDate = newSlice.startDate;
        refSlice.endDate = newSlice.endDate;
        resolution.push(resolutionType.RESOLUTION_SURROUND);
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
        resolution.push(resolutionType.RESOLUTION_WITHIN);
    } else if (compareAgainstMask(score, masks.OVERLAP_START)) {
        refSlice.startDate.setTime(newSlice.endDate.getTime() + _Date2.default.ONEHOUR);
        resolution.push(resolutionType.RESOLUTION_OVERLAP_START);
    } else if (compareAgainstMask(score, masks.OVERLAP_END)) {
        refSlice.endDate.setTime(newSlice.startDate.getTime() - _Date2.default.ONEHOUR);
        resolution.push(resolutionType.RESOLUTION_OVERLAP_END);
    } else {
        duplicate = TimeSliceFactory.create(refSlice.project, refSlice.startDate, refSlice.endDate);
        duplicate.startDate.setTime(newSlice.endDate.getTime() + _Date2.default.ONEHOUR);
        refSlice.endDate.setTime(newSlice.startDate.getTime() - _Date2.default.ONEHOUR);
        resolution.push(resolutionType.RESOLUTION_SURROUND);
        resolution.push(duplicate);
    }

    return duplicate;
}

var OverlapResolver = function () {
    function OverlapResolver(eventManager) {
        _classCallCheck(this, OverlapResolver);

        this.eventManager = eventManager;
    }

    _createClass(OverlapResolver, [{
        key: 'resolve',
        value: function resolve(refSlice, newSlice) {
            var resolveEvent = void 0,
                resolution = void 0;
            if (OverlapResolver.isOverlapping(refSlice, newSlice)) {
                resolveEvent = refSlice.project === newSlice.project ? event.RESOLVED_MERGE : event.RESOLVED_OVERLAP;
                resolution = refSlice.project === newSlice.project ? resolveMerge(refSlice, newSlice) : resolveOverlap(refSlice, newSlice);
                this.eventManager.fire(resolveEvent, resolution);
            }
        }
    }], [{
        key: 'isOverlapping',
        value: function isOverlapping(refSlice, newSlice) {
            return computeOverlapScore(refSlice, newSlice) > 0;
        }
    }]);

    return OverlapResolver;
}();

exports.default = OverlapResolver;