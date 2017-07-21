import {events} from "../TimeLine.es6";

export default class UserLabelWidget {
    constructor(eventsManager) {
        this.eventsManager = eventsManager;
        this.init();
    }

    init() {
        this.eventsManager.bind(events.LINE_ADDED, this.computeEqualWidth);
    }

    computeEqualWidth() {
        let labels = [...document.querySelectorAll('.user-timeline .label')];

        if (labels) {
            labels.forEach(label => delete label.style.width);
            labels.sort((labelA, labelB) => labelA.clientWidth >= labelB.clientWidth ? -1 : 1);
            labels.map(label => label.style.width = `${labels[0].clientWidth}px`);
        }
    }
}