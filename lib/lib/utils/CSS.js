'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var batchAction = function batchAction(elements, className, add) {
    if (!Array.isArray(elements)) {
        elements = [elements];
    }

    var i = void 0,
        total = elements.length;
    for (i = 0; i < total; i += 1) {
        manipulateClassNames(elements[i], className, add);
    }
};

var manipulateClassNames = exports.manipulateClassNames = function manipulateClassNames(element, className) {
    var add = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var classes = (element.className || '').trim().split(' ').filter(function (currentClass) {
        return currentClass !== className;
    });

    if (add) {
        classes.push(className);
    }

    element.className = classes.join(' ').trim();
};

var addClass = exports.addClass = function addClass(element, className) {
    batchAction(element, className, true);
};

var removeClass = exports.removeClass = function removeClass(element, className) {
    batchAction(element, className, false);
};

var toggleClass = exports.toggleClass = function toggleClass(element, className) {
    batchAction(element, className, hasClass(element, className));
};

var hasClass = exports.hasClass = function hasClass(element, className) {
    return (element.className || '').trim().split(' ').filter(function (currentClass) {
        return currentClass === className;
    }).length > 0;
};