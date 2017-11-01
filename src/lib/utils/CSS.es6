let batchAction = function (elements, className, add) {
    if (!Array.isArray(elements)) {
        elements = [elements];
    }

    let i, total = elements.length;
    for (i = 0; i < total; i += 1) {
        manipulateClassNames(elements[i], className, add);
    }
};

export let manipulateClassNames = function (element, className, add = true) {
    let classes = (element.className || '')
        .trim().split(' ')
        .filter(currentClass => currentClass !== className);

    if (add) {
        classes.push(className);
    }

    element.className = classes.join(' ').trim();
};

export let addClass =function (element, className) {
    batchAction(element, className, true);
};

export let removeClass = function (element, className) {
    batchAction(element, className, false);
};

export let toggleClass = function (element, className) {
    batchAction(element, className, hasClass(element, className));
};

export let hasClass = function (element, className) {
    return (element.className || '')
        .trim()
        .split(' ')
        .filter(currentClass => currentClass === className).length > 0;
};