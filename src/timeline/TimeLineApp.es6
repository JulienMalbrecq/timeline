import TimeLineHeaderWidget from "./widget/TimeLineHeaderWidget.es6";
import UserLabelWidget from "./widget/UserLabelWidget.es6";
import {Config} from "../Config.es6";
import TimeLineStyleWidget from "./widget/TimeLineStyleWidget.es6";

export default class TimeLineApp {
    constructor (container) {
        this.container = container;

        this.eventManager = this.container.get('eventsManager');

        this.timeLine = this.container.get('timeLine');
        this.renderer = this.container.get('renderer');

        this.projects = [];

        this.initData().then(() => this.initInterface());
    }

    initData() {
        // init interface after all data has been loaded
        let projectPromise = this.container.get('dataManager').getDataManager('project').findAll(),
            userPromise = this.container.get('dataManager').getDataManager('user').findAll();

        // @todo add timeslice loading to promise list
        return Promise.all([projectPromise, userPromise]).then(results => {
            let entityBank = this.container.get('entityBank');

            entityBank.addBank('projects', results[0]);
            entityBank.addBank('users', results[1]);
        });
    }

    initInterface() {
        // @todo add widgets to the container
        let timeLineHeaderWidget = new TimeLineHeaderWidget(Config.startDate, Config.tileSize, Config.tilesPerDay, Config.daysToShow || 14);
        timeLineHeaderWidget.initInterface();

        let timeLineStyleWidget = new TimeLineStyleWidget(Config.startDate, Config.tileSize, Config.tilesPerDay);
        timeLineStyleWidget.initInterface();

        new UserLabelWidget(this.eventManager);

        this.initTimeLine(this.container.get('entityBank').getBank('users'));
    }

    initTimeLine (users) {
        let groups = [];

        // group by group
        users.forEach(user => {
            let userGroup = groups.find(group => group.name === user.group);
            if (!userGroup) {
                userGroup = {name: user.group, users: []};
                groups.push(userGroup);
            }

            userGroup.users.push(user);
        });

        groups.forEach(group => {
            let tlGroup = this.timeLine.addGroup(group.name);
            group.users.forEach(user => tlGroup.addLine(user));
        });
    }
}
