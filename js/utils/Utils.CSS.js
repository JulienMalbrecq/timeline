var Utils = Utils || {};
Utils.CSS = {
    manipulateClassNames: function (element, className, add) {
        add = add === undefined ? true : add;
        var classes = (element.className || '')
                .trim().split(' ')
                .filter(function (currentClass) {
                    return currentClass !== className;
            });
        
        if (add) {
            classes.push(className);
        }

        element.className = classes.join(' ').trim();
    },

    batchAction: function (elements, className, add) {
        if (!Array.isArray(elements)) {
            elements = [elements];
        }

        var i = 0,
            total = elements.length;

        for (; i < total; i += 1) {
            Utils.CSS.manipulateClassNames(elements[i], className, add);
        }
    },

    addClass: function (element, className) {
        Utils.CSS.batchAction(element, className, true);
    },

    removeClass: function (element, className) {
        Utils.CSS.batchAction(element, className, false);
    },

    toggleClass: function (element, className) {
        var add = !Utils.CSS.hasClass(element, className);
        Utils.CSS.batchAction(element, className, add);
    },

    hasClass: function (element, className) {
        return (element.className || '')
            .trim()
            .split(' ')
            .filter(function(currentClass) { return currentClass === className; }).length > 0;
    }
};